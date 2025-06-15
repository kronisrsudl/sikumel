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
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: 400, width: '100%' }}>
        <h4 className="text-center mb-3">🔐 Login SIKUMEL</h4>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
