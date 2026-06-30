/* ============================================================
   SHAKTI AYURVED CRM — Frontend API Client
   Drop-in replacement for the old direct-Supabase Store module.
   Talks to the Node.js/Express backend over REST + JWT instead.
   Keeps the exact same window.Store interface so the rest of the
   4000-line UI works unmodified.
   ============================================================ */
(function () {
  const BASE = window.API_BASE_URL;
  const TOKEN_KEY = 'shakti_jwt_v1';
  const REFRESH_KEY = 'shakti_refresh_v1';

  function getToken() { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } }
  function setToken(t) { try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  function getRefresh() { try { return localStorage.getItem(REFRESH_KEY); } catch (e) { return null; } }
  function setRefresh(t) { try { if (t) localStorage.setItem(REFRESH_KEY, t); else localStorage.removeItem(REFRESH_KEY); } catch (e) {} }

  async function request(method, path, body, isRetry) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    const opts = { method, headers };
    if (body !== undefined) opts.body = JSON.stringify(body);

    let res;
    try {
      res = await fetch(BASE + path, opts);
    } catch (netErr) {
      throw new Error('Network error: could not reach the server. Is the backend running?');
    }

    if (res.status === 401 && !isRetry) {
      // Try silent refresh once
      const refreshed = await tryRefresh();
      if (refreshed) return request(method, path, body, true);
    }

    let json = null;
    try { json = await res.json(); } catch (e) {}

    if (!res.ok) {
      const msg = (json && json.message) || ('Request failed (' + res.status + ')');
      const err = new Error(msg);
      err.status = res.status;
      err.details = json && json.details;
      throw err;
    }
    return json;
  }

  async function tryRefresh() {
    const refreshToken = getRefresh();
    if (!refreshToken) return false;
    try {
      const res = await fetch(BASE + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json();
      if (!res.ok) return false;
      setToken(json.data.accessToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------------- Auth ---------------- */
  const AuthAPI = {
    async login(username, password) {
      try {
        const r = await request('POST', '/auth/login', { username, password });
        setToken(r.data.accessToken);
        setRefresh(r.data.refreshToken);
        return { ok: true, user: r.data.user };
      } catch (e) {
        return { ok: false, msg: e.message || 'Invalid Username or Password' };
      }
    },
    logout() {
      setToken(null);
      setRefresh(null);
    },
    isAuthenticated() {
      return !!getToken();
    },
    async me() {
      try {
        const r = await request('GET', '/auth/me');
        return r.data.user;
      } catch (e) {
        return null;
      }
    },
  };
  window.AuthAPI = AuthAPI;

  /* ---------------- Local cache (mirrors old `db`) ---------------- */
  let db = { users: [], leads: [], orders: [], settings: { sound: true, browserNotify: true, popup: true } };
  let PRODUCTS = [];
  let inited = false;
  let currentRole = null; // 'admin' | 'agent' — affects which leads/agents are visible

  function genId(p) { return p + '_' + Math.random().toString(36).slice(2, 11); }

  function mapLeadFromApi(l) {
    // Backend already returns a UI-shaped lead object (see leads.service.js mapLeadRow)
    return Object.assign(
      { notes: [], calls: [], timeline: [], order: l.converted ? { amount: l.value, date: l.updatedAt, mode: 'Sale' } : null },
      l
    );
  }

  async function refreshLeads() {
    const r = await request('GET', '/leads');
    db.leads = (r.data || []).map(mapLeadFromApi);
    return db.leads;
  }

  async function refreshAgents() {
    const r = await request('GET', '/agents');
    // keep any existing admin entries already in db.users (none returned by /agents)
    const agents = (r.data || []).map((a) => ({
      id: a.id,
      name: a.name,
      user: a.username,
      username: a.username,
      role: a.role,
      active: a.active,
      status: a.status,
      mobile: a.mobile || '',
      email: a.email || '',
      joined: a.joined,
    }));
    db.users = agents;
    return agents;
  }

  async function refreshProducts() {
    const r = await request('GET', '/products');
    PRODUCTS = r.data || [];
    return PRODUCTS;
  }

  async function refreshOrders() {
    try {
      const r = await request('GET', '/orders');
      db.orders = (r.data || []).map((o) => ({
        id: o.id,
        lead: o.lead_id,
        customer: o.customer_name,
        agent: o.agent_id,
        product: o.product,
        amount: Number(o.amount || 0),
        mode: o.mode,
        date: o.created_at,
      }));
    } catch (e) {
      db.orders = [];
    }
    return db.orders;
  }

  async function refreshSettings() {
    try {
      const r = await request('GET', '/settings');
      db.settings = r.data || db.settings;
    } catch (e) {}
    return db.settings;
  }

  async function init() {
    if (inited) return db;
    inited = true;
    const me = await AuthAPI.me();
    currentRole = me ? me.role : null;
    await Promise.all([refreshProducts(), refreshLeads(), refreshOrders(), refreshSettings()]);
    if (currentRole === 'admin') {
      try { await refreshAgents(); } catch (e) {}
    }
    return db;
  }

  const STATES = ['Maharashtra', 'UP', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'WB', 'Kerala', 'Punjab', 'MP', 'Bihar'];
  const LEAD_STAGES = ['New Lead', 'Follow Up', 'CNP', 'Rejected', 'Completed'];
  const LEAD_STATUS = ['New Lead', 'Follow Up', 'CNP', 'Rejected', 'Completed'];
  const CNP_REASONS = ['Recharge Problem', 'Not Pick', 'Off'];

  function agentNameOf(id) {
    const a = db.users.find((u) => u.id === id);
    return a ? a.name : 'Unassigned';
  }

  const Store = {
    get db() { return db; },
    isOnline() { return true; },
    async ensureLoaded() { if (!db.leads.length) await init(); return db; },
    async init() { return init(); },
    async resyncAll() { await Promise.all([refreshLeads(), refreshOrders()]); if (currentRole === 'admin') await refreshAgents(); return db; },

    products() { return PRODUCTS; },
    product(id) { return PRODUCTS.find((p) => p.id === id); },
    productName(id) { const p = PRODUCTS.find((p) => p.id === id); return p ? p.name : id; },
    productMeta(id) { return PRODUCTS.find((p) => p.id === id) || { name: id, color: '#888', icon: '▪' }; },

    users() { return db.users; },
    agents() { return db.users.filter((u) => u.role === 'agent'); },
    activeAgents() { return db.users.filter((u) => u.role === 'agent' && u.active !== false); },
    agent(id) { return db.users.find((u) => u.id === id); },
    agentName(id) { return agentNameOf(id); },
    people() { return db.users; },

    leads() { return db.leads; },
    lead(id) { return db.leads.find((l) => l.id === id); },

    async addLead(data) {
      const r = await request('POST', '/leads', data);
      const lead = mapLeadFromApi(r.data);
      db.leads.unshift(lead);
      return lead;
    },

    async bulkAddLeads(arr) {
      if (!arr || !arr.length) return [];
      const r = await request('POST', '/leads/bulk', { leads: arr });
      const created = (r.data || []).map(mapLeadFromApi);
      created.forEach((l) => { if (!db.leads.find((x) => x.id === l.id)) db.leads.unshift(l); });
      return created;
    },

    updateLead(id, patch) {
      const l = this.lead(id);
      if (!l) return;
      Object.assign(l, patch, { updatedAt: new Date().toISOString() });
      if (patch.agent !== undefined) l.agentName = this.agentName(patch.agent);
      request('PUT', '/leads/' + id, patch).catch((e) => console.error('updateLead:', e.message));
    },

    deleteLead(id) {
      db.leads = db.leads.filter((l) => l.id !== id);
      db.orders = (db.orders || []).filter((o) => o.lead !== id);
      request('DELETE', '/leads/' + id).catch((e) => console.error('deleteLead:', e.message));
    },

    addTimeline(id, type, text, who) {
      const l = this.lead(id);
      if (!l) return;
      l.timeline.unshift({ id: genId('ev'), type, when: new Date().toISOString(), who, text });
      l.updatedAt = new Date().toISOString();
    },
    addNote(id, text, who) {
      const l = this.lead(id);
      if (!l) return;
      l.notes.unshift({ id: genId('nt'), text, who, when: new Date().toISOString() });
      this.addTimeline(id, 'note', 'Note added', who);
    },
    addCall(id, o, d, w) {
      const l = this.lead(id);
      if (!l) return;
      l.calls.unshift({ id: genId('cl'), outcome: o, dur: d, who: w, when: new Date().toISOString() });
      this.addTimeline(id, 'call', 'Call: ' + o, w);
    },

    setCNP(id, reason, who) {
      const l = this.lead(id);
      if (!l) return;
      l.status = 'CNP'; l.cnpReason = reason; l.stage = 'Working'; l.updatedAt = new Date().toISOString();
      this.addTimeline(id, 'cnp', 'CNP - ' + reason, who);
      request('POST', '/leads/' + id + '/cnp', { reason }).catch((e) => console.error('setCNP:', e.message));
    },

    completeLead(id, rate, qty, who) {
      const l = this.lead(id);
      if (!l) return;
      const amt = rate * qty;
      l.stage = 'Converted'; l.status = 'Converted'; l.converted = true; l.followUp = null;
      l.rate = rate; l.quantity = qty; l.value = amt; l.orderStatus = 'Address Pending';
      l.updatedAt = new Date().toISOString();
      l.order = { id: genId('ord'), amount: amt, date: l.updatedAt, mode: 'Sale' };
      db.orders.push({ ...l.order, lead: l.id, product: l.product, customer: l.name, agent: l.agent });
      this.addTimeline(id, 'completed', 'Completed - Rs' + amt, who);
      request('POST', '/leads/' + id + '/complete', { rate, quantity: qty }).catch((e) => console.error('completeLead:', e.message));
    },

    setOrderStatus(id, os, extra, who) {
      const l = this.lead(id);
      if (!l) return;
      l.orderStatus = os;
      if (os === 'Rejected') { l.stage = 'Lost'; l.status = 'Rejected'; l.followUp = null; }
      if (extra && extra.address) l.deliveryAddress = extra.address;
      if (extra && extra.advanceAmount) l.advanceAmount = extra.advanceAmount;
      l.updatedAt = new Date().toISOString();
      this.addTimeline(id, 'orderstatus', 'Order - ' + os, who);
      request('POST', '/leads/' + id + '/order-status', { orderStatus: os, address: extra && extra.address, advanceAmount: extra && extra.advanceAmount })
        .catch((e) => console.error('setOrderStatus:', e.message));
    },

    rejectLead(id, who) {
      const l = this.lead(id);
      if (!l) return;
      l.stage = 'Lost'; l.status = 'Rejected'; l.followUp = null; l.leadType = 'Rejected'; l.updatedAt = new Date().toISOString();
      this.addTimeline(id, 'rejected', 'Rejected', who);
      request('POST', '/leads/' + id + '/reject').catch((e) => console.error('rejectLead:', e.message));
    },

    async addAgent(data) {
      const r = await request('POST', '/agents', data);
      const a = Object.assign({ role: 'agent', active: true, status: 'active' }, r.data, { user: r.data.username, pass: r.data.generatedPassword });
      db.users.push(a);
      return a;
    },

    updateAgent(id, patch) {
      const a = this.agent(id);
      if (!a) return;
      Object.assign(a, patch);
      if (patch.user !== undefined) a.username = patch.user;
      if (patch.active !== undefined) a.status = patch.active ? 'active' : 'inactive';
      const apiPatch = {};
      if (patch.name !== undefined) apiPatch.name = patch.name;
      if (patch.user !== undefined) apiPatch.username = patch.user;
      if (patch.mobile !== undefined) apiPatch.mobile = patch.mobile;
      if (patch.email !== undefined) apiPatch.email = patch.email;
      if (patch.active !== undefined) apiPatch.active = patch.active;
      if (patch.pass !== undefined) apiPatch.password = patch.pass;
      request('PUT', '/agents/' + id, apiPatch).catch((e) => console.error('updateAgent:', e.message));
    },

    deleteAgent(id) {
      db.users = db.users.filter((u) => u.id !== id);
      db.leads.forEach((l) => { if (l.agent === id) { l.agent = null; l.agentName = null; } });
      request('DELETE', '/agents/' + id).catch((e) => console.error('deleteAgent:', e.message));
    },

    toggleAgent(id) {
      const a = this.agent(id);
      if (!a) return a;
      a.active = !a.active;
      a.status = a.active ? 'active' : 'inactive';
      request('POST', '/agents/' + id + '/toggle-active').catch((e) => console.error('toggleAgent:', e.message));
      return a;
    },

    resetAgentPassword(id) {
      const a = this.agent(id);
      if (!a) return a;
      request('POST', '/agents/' + id + '/reset-password')
        .then((r) => { a.pass = r.data.newPassword; })
        .catch((e) => console.error('resetAgentPassword:', e.message));
      return a;
    },

    genLoginId(name) {
      const b = (name || 'agent').toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'agent';
      let n = b, i = 1;
      while (db.users.some((u) => (u.user || u.username) === n)) { n = b + i; i++; }
      return n;
    },
    genPassword() { return Math.random().toString(36).slice(2, 8) + Math.floor(Math.random() * 90 + 10); },

    async assignLeads(aid, count, prod, ltype, by) {
      const r = await request('POST', '/assignment/assign', { agentId: aid, count, product: prod, leadType: ltype });
      await refreshLeads();
      return r.data.assigned;
    },

    async distributeLeads(count, prod, ltype, by) {
      const r = await request('POST', '/assignment/distribute', { count, product: prod, leadType: ltype });
      await refreshLeads();
      return r.data.assigned;
    },

    orders() { return db.orders || []; },
    revenue() { return (db.orders || []).reduce((s, o) => s + (o.amount || 0), 0); },

    findUser(user) {
      // Used only by the legacy session-restore check; agents() cache may not include
      // the logged-in admin if role !== admin, so this is best-effort from cache.
      return db.users.find((u) => (u.user || u.username) === user || u.mobile === user || u.name === user);
    },

    settings() { return db.settings; },
    updateSettings(p) {
      Object.assign(db.settings, p);
      request('PUT', '/settings', p).catch((e) => console.error('updateSettings:', e.message));
    },

    reset() { console.warn('Store.reset() is disabled — data now lives in Supabase via the backend API.'); return db; },
    save() { /* no-op: writes go straight to the backend */ },
  };

  window.Store = Store;
  window.STATES = STATES;
  window.LEAD_STAGES = LEAD_STAGES;
  window.LEAD_STATUS = LEAD_STATUS;
  window.CNP_REASONS = CNP_REASONS;
  // window.PRODUCTS populated lazily after refreshProducts(); UI code reads Store.products() anyway.
})();
