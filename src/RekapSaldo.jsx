import { useEffect, useState } from 'react';
import axios from 'axios';

function RekapSaldo() {
  const [data, setData] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  
  useEffect(() => {
    axios.get(`${API}/api/rekap-saldo`)
      .then(res => setData(res.data))
      .catch(err => console.error('Gagal ambil rekap:', err));
  }, []);

  return (
    <div className="container">
      <h4 className="text-center my-3">📊 Rekap Saldo Obat</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>Nama Obat</th>
              <th>Total Obat</th>
              <th>Total Pembayaran</th>
              <th>Saldo</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.nama_obat}</td>
                <td className="text-end">{row.total_jumlah_obat}</td>
                <td className="text-end">{row.total_jumlah_pembayaran}</td>
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
