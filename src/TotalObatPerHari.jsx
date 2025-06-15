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
      await axios.post(`${API}/api/rekap-obat`, {
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
    <div className="container">
      <h4 className="text-center my-3">💊 Rekap Obat per Hari</h4>
      {isAdmin && (
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4 position-relative">
        <input
            className="form-control"
            placeholder="Nama Obat"
            value={namaObat}
            onChange={handleNamaObatChange}
            onKeyDown={handleKeyDown}
            required
            autoComplete="off"
        />
        {saranObat.length > 0 && (
            <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {saranObat.map((item, index) => (
                <li
                key={index}
                className={`list-group-item ${index === highlightIndex ? 'active text-white' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setNamaObat(item.nama_obat);
                    setSaranObat([]);
                    setHighlightIndex(-1);
                }}
                >
                {item.nama_obat} <span className="text-muted">({item.harga})</span>
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
          <button className="btn btn-primary w-100" type="submit">
            Simpan
          </button>
        </div>
      </form>
      )}


      
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
            type="text"
            className="form-control w-50"
            placeholder="Cari nama obat atau tanggal..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset ke halaman 1 saat filter berubah
            }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>Tanggal</th>
              <th>Nama Obat</th>
              <th>Total Obat</th>
              <th>Total Pembayaran</th>
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
                <td>{item.tanggal}</td>
                <td style={{ cursor: 'pointer' }} onClick={() => handleIsiForm(item)}>
                    <strong>{item.nama_obat}</strong>
                </td>
                <td className="text-end">{item.total_jumlah}</td>
                <td className="text-end">{item.total_pembayaran}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
            className="d-flex justify-content-between align-items-center mt-3 pb-5 bg-white sticky-bottom py-2 border-top"
            style={{ zIndex: 10 }}
        >

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
