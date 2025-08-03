import { useEffect, useState } from 'react';
import axios from 'axios';

function RekapSaldo() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('pending'); // default urut berdasarkan pending
  const [sortAsc, setSortAsc] = useState(false); // default descending

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/api/rekap-saldo`)
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal ambil rekap:', err));
  }, []);

  const filteredData = data
    .filter(item =>
      item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'nama_obat') {
        return sortAsc
          ? a.nama_obat.localeCompare(b.nama_obat)
          : b.nama_obat.localeCompare(a.nama_obat);
      } else {
        return sortAsc
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      }
    });

  return (
    <div className="container mx-auto py-3">
      <h4 className="text-center mb-3">📊 Rekap Saldo Obat</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="col-span-1">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Cari nama obat..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-span-1 flex gap-2">
          <select
            className="px-3 py-2 border rounded-md"
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
          >
            <option value="pending">Urutkan: Pending</option>
            <option value="saldo">Urutkan: Saldo</option>
            <option value="nama_obat">Urutkan: Nama Obat</option>
          </select>
          <button
            className="px-2 py-1 border rounded-md"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? '🔼' : '🔽'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white text-center align-middle">
            <tr>
              <th className="py-2 px-4">Nama Obat</th>
              <th className="py-2 px-4">Saldo</th>
              <th className="py-2 px-4">Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{row.nama_obat}</td>
                <td className="border px-4 py-2 text-right text-green-500">{row.saldo}</td>
                <td className="border px-4 py-2 text-right text-red-500">{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RekapSaldo;
