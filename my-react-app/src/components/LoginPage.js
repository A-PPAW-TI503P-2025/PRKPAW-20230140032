import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-gray-700">Email:</label>
          <input type="email" className="w-full p-2 mb-4 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="block mb-2 text-gray-700">Password:</label>
          <input type="password" className="w-full p-2 mb-4 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          <a href="/register" className="text-blue-600 font-semibold ml-1 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;