import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');
    try {
      const res = await axios.post(`${API}/api/login`, { username, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username); // ⬅️ Tambahkan ini

      navigate('/copyResep'); // atau ke dashboard utama
    } catch (err) {
      setErrMsg(err.response?.data?.error || 'Login gagal');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Login SIKUMEL</h2>
          <p className="text-gray-500 mt-2">Selamat datang kembali!</p>
        </div>
        {errMsg && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errMsg}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
