const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
router.use(addUserData);
const { body, validationResult } = require('express-validator');

router.use(addUserData);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
module.exports = router;

router.put(
  '/:id',
  [
    body('checkIn')
      .optional()
      .isISO8601()
      .withMessage('checkIn harus berupa format tanggal yang valid (ISO 8601)'),
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage('checkOut harus berupa format tanggal yang valid (ISO 8601)'),
  ],
  (req, res, next) => {
    // Cek hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors: errors.array(),
      });
    }
    next();
  },
  presensiController.updatePresensi
);

router.delete("/:id", presensiController.deletePresensi);

module.exports = router;