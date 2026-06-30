const fs = require('fs');
const XLSX = require('xlsx');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');
const { ApiError } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');

// Import leads from an uploaded Excel/CSV file
const importLeads = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  fs.unlink(req.file.path, () => {}); // cleanup temp file

  if (!rows.length) throw new ApiError(400, 'The uploaded file has no data rows');

  const items = rows
    .map((r) => ({
      name: r.name || r.Name || r['Customer Name'] || '',
      mobile: String(r.mobile || r.Mobile || r.Phone || '').trim(),
      product: (r.product || r.Product || 'kidney').toString().toLowerCase(),
      email: r.email || r.Email || '',
    }))
    .filter((r) => r.name && r.mobile);

  if (!items.length) {
    throw new ApiError(400, 'No valid rows found. Required columns: name, mobile (product optional)');
  }

  const result = await leadsService.bulkCreate(items, req.user.name);
  return created(res, { imported: result.length, skipped: rows.length - items.length }, `${result.length} leads imported`);
});

// Export leads to Excel
const exportLeads = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.user.role === 'agent') filters.agent = req.user.id;
  const leads = await leadsService.list(filters);

  const data = leads.map((l) => ({
    Name: l.name,
    Mobile: l.mobile,
    Product: l.product,
    Stage: l.stage,
    Status: l.status,
    Agent: l.agentName || '',
    FollowUp: l.followUp || '',
    Rate: l.rate,
    Quantity: l.quantity,
    Value: l.value,
    OrderStatus: l.orderStatus || '',
    CreatedAt: l.createdAt,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename="leads_export.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

module.exports = { importLeads, exportLeads };
