const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/importExport.controller');

router.use(authenticate);

router.post('/import', authorize('admin'), upload.single('file'), ctrl.importLeads);
router.get('/export', ctrl.exportLeads);

module.exports = router;
