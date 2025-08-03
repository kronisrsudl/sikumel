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
    <div className="container mx-auto">
      <h4 className="text-center my-3">🤝 Serah Terima Obat</h4>
      {isAdmin && (
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="col-span-1 relative">
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Nama Obat"
            value={namaObat}
            onChange={handleNamaObatChange}
            required
            autoComplete="off"
          />
          {saranObat.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-md mt-1 z-10">
              {saranObat.map((item, idx) => (
                <li
                  key={idx}
                  className="p-2 cursor-pointer hover:bg-gray-200"
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
        <div className="col-span-1">
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1">
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1">
          <button className="bg-blue-500 text-white w-full py-2 rounded-md">Simpan</button>
          {editId && (
          <div className="text-right mt-2">
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded-md"
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

      <div className="overflow-x-auto">
        <div className="flex justify-between items-center my-3">
        <input
            type="text"
            className="w-1/2 px-3 py-2 border rounded-md"
            placeholder="Cari nama obat atau tanggal..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
            }}
        />
        </div>

        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white text-center align-middle">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nama Obat</th>
              <th className="py-2 px-4">Jumlah</th>
              <th className="py-2 px-4">Untuk Tanggal</th>
              <th className="py-2 px-4">Tanggal Transaksi</th>
              {isAdmin && (
              <th className="py-2 px-4">Aksi</th>
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
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.nama_obat}</td>
                <td className="border px-4 py-2 text-right">{item.total}</td>
                <td className="border px-4 py-2">{new Date(item.tanggal).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(item.tanggal_transaksi).toLocaleString()}</td>
                {isAdmin && (
                <td className="border px-4 py-2 text-center">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => handleDelete(item.id)}>
                  Hapus
                </button>
              </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
        <button
            className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            &laquo; Prev
        </button>

        <span>Halaman {currentPage}</span>

        <button
            className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md"
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
