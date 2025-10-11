const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/books'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('Selamat datang di API Perpustakaan Buku!');
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error('Terjadi Error:', err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});