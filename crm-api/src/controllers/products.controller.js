const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');

const PRODUCTS = [
  { id: 'kidney', name: 'Kidney Stone', icon: '💎', color: '#1f6feb', desc: 'Stone relief', price: 1490 },
  { id: 'earcare', name: 'Ear Care', icon: '👂', color: '#7c4dff', desc: 'Ear wellness', price: 1290 },
  { id: 'piles', name: 'Piles', icon: '🌿', color: '#0c9351', desc: 'Piles care', price: 1690 },
];

const list = asyncHandler(async (req, res) => ok(res, PRODUCTS));

const getOne = asyncHandler(async (req, res) => {
  const p = PRODUCTS.find((x) => x.id === req.params.id);
  if (!p) return ok(res, null, 'Not found', 404);
  return ok(res, p);
});

module.exports = { list, getOne, PRODUCTS };
