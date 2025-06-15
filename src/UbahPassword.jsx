import { useState } from 'react';
import axios from 'axios';

function UbahPassword() {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [pesan, setPesan] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPesan('');

    if (passwordBaru !== konfirmasi) {
      return setPesan('Konfirmasi password tidak cocok');
    }

    try {
      const res = await axios.put(`${API}/api/ganti-password`, {
        passwordLama,
        passwordBaru
      });

      setPesan(res.data.message || 'Password berhasil diubah');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasi('');
    } catch (err) {
      setPesan(err.response?.data?.error || 'Gagal ubah password');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h5>🔒 Ubah Password</h5>
      {pesan && <div className="alert alert-info">{pesan}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password Lama"
          value={passwordLama}
          onChange={(e) => setPasswordLama(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password Baru"
          value={passwordBaru}
          onChange={(e) => setPasswordBaru(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Konfirmasi Password Baru"
          value={konfirmasi}
          onChange={(e) => setKonfirmasi(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Simpan Perubahan</button>
      </form>
    </div>
  );
}

export default UbahPassword;
