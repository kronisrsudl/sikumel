import { useEffect, useState } from 'react';
import axios from 'axios';

function SerahTerimaObat() {
  const [list, setList] = useState([]);
  const [namaObat, setNamaObat] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [dataObat, setDataObat] = useState([]);
  const [saranObat, setSaranObat] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const [editId, setEditId] = useState(null);
  
  const username = localStorage.getItem('username');
  const isAdmin = username === 'rsudl';

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchList();
    axios.get(`${API}/api/data_obat`)
      .then(res => setDataObat(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${API}/api/pembayaran`);
      setList(res.data);
    } catch (err) {
      console.error('Gagal ambil data pembayaran', err);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

    try {
      if (editId) {
        // Mode Edit
        await axios.put(`${API}/api/pembayaran/${editId}`, {
          nama_obat: namaObat,
          jumlah,
          tanggal
        });
      } else {
        // Mode Tambah
        await axios.post(`${API}/api/pembayaran`, {
          nama_obat: namaObat,
          jumlah,
          tanggal
        });
      }

      // Reset form
      setNamaObat('');
      setJumlah('');
      setTanggal('');
      setEditId(null);
      fetchList();
    } catch (err) {
      alert('Gagal simpan data');
    }
  };


  const handleNamaObatChange = (e) => {
    const input = e.target.value;
    setNamaObat(input);
    setSaranObat(
      dataObat.filter(item =>
        item.nama_obat.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5)
    );
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNamaObat(item.nama_obat);
    setJumlah(item.total);
    setTanggal(item.tanggal?.split('T')[0]);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus data ini?')) {
      try {
        await axios.delete(`${API}/api/pembayaran/${id}`);
        fetchList();
      } catch (err) {
        alert('Gagal hapus data');
      }
    }
  };

  return (
    <div className="container">
      <h4 className="text-center my-3">🤝 Serah Terima Obat</h4>
      {isAdmin && (
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4 position-relative">
          <input
            className="form-control"
            placeholder="Nama Obat"
            value={namaObat}
            onChange={handleNamaObatChange}
            required
            autoComplete="off"
          />
          {saranObat.length > 0 && (
            <ul className="list-group position-absolute w-100 z-3">
              {saranObat.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNamaObat(item.nama_obat);
                    setSaranObat([]);
                  }}
                >
                  {item.nama_obat}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Simpan</button>
          {editId && (
          <div className="col-md-12 text-end">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setNamaObat('');
                setJumlah('');
                setTanggal('');
              }}
            >
              Batal Edit
            </button>
          </div>
        )}

        </div>
      </form>
      )}

      <div className="table-responsive">
        <div className="d-flex justify-content-between align-items-center my-3">
        <input
            type="text"
            className="form-control w-50"
            placeholder="Cari nama obat atau tanggal..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            }}
        />
        </div>

        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>ID</th>
              <th>Nama Obat</th>
              <th>Jumlah</th>
              <th>Untuk Tanggal</th>
              <th>Tanggal Transaksi</th>
              {isAdmin && (
              <th>Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {list
                .filter(item =>
                    item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    new Date(item.tanggal).toLocaleDateString().includes(searchTerm)
                )
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item, idx) => (

              <tr key={idx}>
                <td>{item.id}</td>
                <td>{item.nama_obat}</td>
                <td className="text-end">{item.total}</td>
                <td>{new Date(item.tanggal).toLocaleDateString()}</td>
                <td>{new Date(item.tanggal_transaksi).toLocaleString()}</td>
                {isAdmin && (
                <td className="text-center">
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                  Hapus
                </button>
              </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center mt-4">
        <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            &laquo; Prev
        </button>

        <span>Halaman {currentPage}</span>

        <button
            className="btn btn-outline-primary"
            onClick={() => {
            const totalFiltered = list.filter(item =>
                item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(item.tanggal).toLocaleDateString().includes(searchTerm)
            ).length;
            const maxPage = Math.ceil(totalFiltered / itemsPerPage);
            setCurrentPage(prev => Math.min(prev + 1, maxPage));
            }}
            disabled={
            currentPage >= Math.ceil(
                list.filter(item =>
                item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(item.tanggal).toLocaleDateString().includes(searchTerm)
                ).length / itemsPerPage
            )
            }
        >
            Next &raquo;
        </button>
        </div>

      </div>
    </div>
  );
}

export default SerahTerimaObat;
