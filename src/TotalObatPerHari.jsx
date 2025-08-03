import { useEffect, useState } from 'react';
import axios from 'axios';

function TotalObatPerHari() {
  const [rekap, setRekap] = useState([]);
  const [namaObat, setNamaObat] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggal, setTanggal] = useState('');

  const [dataObat, setDataObat] = useState([]);
  const [saranObat, setSaranObat] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);


  const username = localStorage.getItem('username');
  const isAdmin = username === 'rsudl';

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const API = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
  fetchRekap();

  axios.get(`${API}/api/data_obat`)
      .then(res => setDataObat(res.data))
      .catch(err => console.error('Gagal ambil data_obat:', err));
  }, []);


  const fetchRekap = async () => {
    try {
      const res = await axios.get(`${API}/api/rekap-obat`);
      setRekap(res.data);
    } catch (err) {
      console.error('Gagal ambil rekap:', err);
    }
  };

  const handleNamaObatChange = (e) => {
    const input = e.target.value;
    setNamaObat(input);

    if (input.length === 0) {
        setSaranObat([]);
        return;
    }

    const saran = dataObat.filter(item =>
        item.nama_obat.toLowerCase().includes(input.toLowerCase())
    );
    setSaranObat(saran.slice(0, 5)); // maksimal 5 saran
    };

    const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
        setHighlightIndex((prev) => (prev + 1) % saranObat.length);
    } else if (e.key === 'ArrowUp') {
        setHighlightIndex((prev) => (prev - 1 + saranObat.length) % saranObat.length);
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
        e.preventDefault();
        const selected = saranObat[highlightIndex];
        setNamaObat(selected.nama_obat);
        setJumlah(selected.harga);
        setSaranObat([]);
        setHighlightIndex(-1);
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/pembayaran`, {
        nama_obat: namaObat,
        jumlah,
        tanggal
      });
      setNamaObat('');
      setJumlah('');
      setTanggal('');
      fetchRekap();
    } catch (err) {
      alert('Gagal simpan pembayaran');
      console.error(err);
    }
  };

  const handleIsiForm = (item) => {
    const jumlahSelisih = Math.max(0, item.total_jumlah - item.total_pembayaran);

    setNamaObat(item.nama_obat);
    setTanggal(item.tanggal); // sudah dalam format yyyy-mm-dd
    setJumlah(jumlahSelisih);
  };

  return (
    <div className="container mx-auto">
      <h4 className="text-center my-3">💊 Rekap Obat per Hari</h4>
      {isAdmin && (
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="col-span-1 relative">
        <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Nama Obat"
            value={namaObat}
            onChange={handleNamaObatChange}
            onKeyDown={handleKeyDown}
            required
            autoComplete="off"
        />
        {saranObat.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-md mt-1 z-10" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {saranObat.map((item, index) => (
                <li
                key={index}
                className={`p-2 cursor-pointer ${index === highlightIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                onClick={() => {
                    setNamaObat(item.nama_obat);
                    setSaranObat([]);
                    setHighlightIndex(-1);
                }}
                >
                {item.nama_obat} <span className="text-gray-500">({item.harga})</span>
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
          <button className="bg-blue-500 text-white w-full py-2 rounded-md" type="submit">
            Simpan
          </button>
        </div>
      </form>
      )}


      
      <div className="mb-3 flex justify-between items-center">
        <input
            type="text"
            className="w-1/2 px-3 py-2 border rounded-md"
            placeholder="Cari nama obat atau tanggal..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset ke halaman 1 saat filter berubah
            }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white text-center align-middle">
            <tr>
              <th className="py-2 px-4">Tanggal</th>
              <th className="py-2 px-4">Nama Obat</th>
              <th className="py-2 px-4">Total Obat</th>
              <th className="py-2 px-4">Total Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {rekap
                .filter(item =>
                    item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.tanggal.includes(searchTerm)
                )
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item, idx) => (

              <tr key={idx}>
                <td className="border px-4 py-2">{item.tanggal}</td>
                <td className="border px-4 py-2 cursor-pointer" onClick={() => handleIsiForm(item)}>
                    <strong>{item.nama_obat}</strong>
                </td>
                <td className="border px-4 py-2 text-right">{item.total_jumlah}</td>
                <td className="border px-4 py-2 text-right">{item.total_pembayaran}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
            className="flex justify-between items-center mt-3 pb-5 bg-white sticky bottom-0 py-2 border-t"
            style={{ zIndex: 10 }}
        >

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
                const totalFiltered = rekap.filter(item =>
                    item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.tanggal.includes(searchTerm)
                ).length;
                const maxPage = Math.ceil(totalFiltered / itemsPerPage);
                setCurrentPage(prev => Math.min(prev + 1, maxPage));
                }}
                disabled={
                currentPage >= Math.ceil(
                    rekap.filter(item =>
                    item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.tanggal.includes(searchTerm)
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

export default TotalObatPerHari;
