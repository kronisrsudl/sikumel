import { useState } from 'react';
import axios from 'axios';

function UbahPassword() {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [pesan, setPesan] = useState('');

  const API = import.meta.env.VITE_API_URL;

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔒 Ubah Password</h2>
        {pesan && (
          <div className={`p-4 text-sm rounded-lg ${pesan.includes('gagal') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`} role="alert">
            {pesan}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="passwordLama">Password Lama</label>
            <input
              id="passwordLama"
              type="password"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              placeholder="Password Lama"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="passwordBaru">Password Baru</label>
            <input
              id="passwordBaru"
              type="password"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              placeholder="Password Baru"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="konfirmasi">Konfirmasi Password Baru</label>
            <input
              id="konfirmasi"
              type="password"
              className="w-full px-4 py-3 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              placeholder="Konfirmasi Password Baru"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}

export default UbahPassword;
