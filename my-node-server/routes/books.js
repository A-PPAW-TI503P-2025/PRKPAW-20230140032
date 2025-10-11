const express = require('express');
const router = express.Router();

// Data sementara (bisa pakai file JSON kalau mau)
let books = [
  { id: 1, title: 'Marmut Merah Jambu', author: 'Raditya Dika' },
  { id: 2, title: 'Kambing Jantan', author: 'Raditya Dika' }
];

// ✅ READ (GET all)
router.get('/', (req, res) => {
  res.json(books);
});

// ✅ READ (GET by ID)
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(book);
});

// ✅ CREATE (POST)
router.post('/', (req, res) => {
  const { title, author } = req.body;

  // Validasi input
  if (!title || !author) {
    return res.status(400).json({ message: 'Judul dan Penulis tidak sesuai' });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// ✅ UPDATE (PUT)
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Buku tidak ditemukan' });

  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Judul dan Penulis tidak sesuai' });
  }

  book.title = title;
  book.author = author;

  res.json(book);
});

// ✅ DELETE (DELETE)
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Buku tidak ditemukan' });

  const deleted = books.splice(index, 1);
  res.json({ message: 'Buku berhasil dihapus', deleted: deleted[0] });
});

module.exports = router;