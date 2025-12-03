import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama,
        email,
        password,
        role
      });

      navigate('/login'); // setelah register, pindah ke login
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Register gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;