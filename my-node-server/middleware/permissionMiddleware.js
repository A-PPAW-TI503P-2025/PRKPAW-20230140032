// C:\PAW\my-node-server\middleware\permissionMiddleware.js

const jwt = require('jsonwebtoken'); 
// KUNCI RAHASIA HARUS SAMA PERSIS DENGAN YANG ADA DI authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

/**
 * Middleware untuk memverifikasi JWT dan otentikasi user.
 */
const authenticateToken = (req, res, next) => {
    // Ambil token dari header Authorization (format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Jika tidak ada token, kembalikan 401 Unauthorized
    if (token == null) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token MENGGUNAKAN JWT_SECRET YANG SAMA
    jwt.verify(token, JWT_SECRET, (err, user) => { 
        // Jika token tidak valid/kadaluarsa, kembalikan 403 Forbidden
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
        }
        
        // Token valid, simpan payload user di req.user
        req.user = user;
        next(); // Lanjutkan ke handler berikutnya
    });
};

/**
 * Middleware untuk memverifikasi apakah user memiliki role 'admin'.
 * Harus dijalankan SETELAH authenticateToken.
 */
const isAdmin = (req, res, next) => {
    // Diasumsikan payload user memiliki properti 'role'
    if (req.user && req.user.role === 'admin') {
        next(); // Lanjutkan
    } else {
        return res.status(403).json({ message: 'Akses ditolak. Diperlukan hak akses Admin.' });
    }
};

// WAJIB: Gunakan Named Export untuk kedua fungsi
module.exports = {
    authenticateToken, // Ini yang di-require di presensi.js
    isAdmin, 
};