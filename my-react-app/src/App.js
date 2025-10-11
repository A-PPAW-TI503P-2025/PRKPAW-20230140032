import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Integrasi React dan Node.js</h1>
      <p>Pesan dari server: {message}</p>
      {/* Tambahan fitur input nama dan hello */}
      <hr style={{ margin: '32px 0' }} />
      <HelloNama />
    </div>
  );
}


function HelloNama() {
  const [name, setName] = useState('');
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Hello, {name ? name : '...'}</h2>
      <input
        type="text"
        placeholder="Masukkan nama Anda"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', marginTop: '10px' }}
      />
    </div>
  );
}

export default App;

// ook
// kjsggdggd
// tes commit