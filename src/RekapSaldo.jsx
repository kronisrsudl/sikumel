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
    <div className="container py-3">
      <h4 className="text-center mb-3">📊 Rekap Saldo Obat</h4>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama obat..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex gap-2">
          <select
            className="form-select"
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
          >
            <option value="pending">Urutkan: Pending</option>
            <option value="saldo">Urutkan: Saldo</option>
            <option value="nama_obat">Urutkan: Nama Obat</option>
          </select>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? '🔼 A-Z / Kecil' : '🔽 Z-A / Besar'}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>Nama Obat</th>
              <th>Saldo</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.nama_obat}</td>
                <td className="text-end text-success">{row.saldo}</td>
                <td className="text-end text-danger">{row.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RekapSaldo;
