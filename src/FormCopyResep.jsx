// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function FormCopyResep() {
  const [noRM, setNoRM] = useState('');
  const [namaPasien, setNamaPasien] = useState('');
  const [modalInputObat, setModalInputObat] = useState(false);
  const [modalTambahPasien, setModalTambahPasien] = useState(false);
  const [currentNoRM, setCurrentNoRM] = useState(null);

  const [namaObat, setNamaObat] = useState('');
  const [harga, setHarga] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [dataObat, setDataObat] = useState([]);
  const [saranObat, setSaranObat] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [semuaObat, setSemuaObat] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const [tanggalAwal, setTanggalAwal] = useState(today);
  const [tanggalAkhir, setTanggalAkhir] = useState(today);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [sortBy, setSortBy] = useState('tanggal');
  const [sortAsc, setSortAsc] = useState(false); // default: descending

  const username = localStorage.getItem('username');
  const isAdmin = username === 'rsudl';

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    
    const fetchDataObat = async () => {
      try {
        const res = await axios.get(`${API}/api/data_obat`);
        setDataObat(res.data);
      } catch (err) {
        console.error('Gagal ambil data_obat:', err);
      }
    };

    fetchDataObat();
    fetchSemuaObat(); // ini akan ambil data berdasarkan filter aktif
  }, [tanggalAwal, tanggalAkhir, searchKeyword]);


  const fetchSemuaObat = async () => {
    try {
      const res = await axios.get(`${API}/api/obat`, {
        params: {
          start: tanggalAwal,
          end: tanggalAkhir,
          search: searchKeyword
        }
      });
      setSemuaObat(res.data);
    } catch (err) {
      console.error('Gagal ambil semua data obat:', err);
    }
  };



  const handleCekRM = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API}/api/rekam_medis/${noRM}`);
      setNamaPasien(res.data.nama_pasien);
      setCurrentNoRM(noRM);
      setModalInputObat(true);
    } catch (err) {
      setModalTambahPasien(true);
    }
  };

  const handleSimpanPasienBaru = async () => {
    try {
      await axios.post(`${API}/api/rekam_medis`, {
        no_rm: parseInt(noRM),
        nama_pasien: namaPasien
      });
      setCurrentNoRM(noRM);
      setModalTambahPasien(false);
      setModalInputObat(true);
      setNoRM('');
      setNamaPasien('');
    } catch (err) {
      alert('Gagal menambahkan pasien baru');
    }
  };

  const handleObatChange = (e) => {
    const val = e.target.value;
    setNamaObat(val);
    if (val.length >= 2) {
      const filter = dataObat.filter(o => o.nama_obat.toLowerCase().includes(val.toLowerCase()));
      setSaranObat(filter);
      setHighlightIndex(-1);
    } else {
      setSaranObat([]);
    }
  };

  const handleObatKeyDown = (e) => {
    if (saranObat.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightIndex(prev => (prev + 1) % saranObat.length);
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(prev => (prev - 1 + saranObat.length) % saranObat.length);
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      const selected = saranObat[highlightIndex];
      setNamaObat(selected.nama_obat);
      setHarga(selected.harga);
      setSaranObat([]);
      e.preventDefault();
    }
  };

  const handleSubmitObat = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/obat`, {
        no_rm: parseInt(currentNoRM),
        nama_obat: namaObat,
        harga: parseFloat(harga),
        jumlah: parseInt(jumlah),
        sudah_diserahkan: false
      });
      alert('Obat berhasil disimpan');
      setNamaObat('');
      setHarga('');
      setJumlah(1);
      fetchSemuaObat();
    } catch (err) {
      alert('Gagal simpan obat');
    }
  };

  const filterByTanggal = (tanggal) => {
    const tgl = tanggal.split('T')[0];
    return tgl >= tanggalAwal && tgl <= tanggalAkhir;
  };

  const handleHapusObat = async (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`${API}/api/obat/${id}`);
        fetchSemuaObat(); // Refresh data
      } catch (err) {
        alert('Gagal menghapus data');
        console.error(err);
      }
    }
  };

  const [modalEditObat, setModalEditObat] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    id: '',
    nama_obat: '',
    harga: '',
    jumlah: ''
  });

  const bukaModalEdit = (item) => {
    setDataEdit({
      id: item.id,
      nama_obat: item.nama_obat,
      harga: item.harga,
      jumlah: item.jumlah
    });
    setModalEditObat(true);
  };

  const handleSimpanEdit = async () => {
    try {
      await axios.put(`${API}/api/obat/${dataEdit.id}`, {
        nama_obat: dataEdit.nama_obat,
        harga: parseFloat(dataEdit.harga),
        jumlah: parseInt(dataEdit.jumlah)
      });
      fetchSemuaObat(); // Refresh data
      setModalEditObat(false);
    } catch (err) {
      alert('Gagal mengedit data');
      console.error(err);
    }
  };

  const toggleStatusDiserahkan = async (id, statusLama) => {
    try {
      await axios.patch(`${API}/api/obat/${id}/status`, {
        sudah_diserahkan: !statusLama,
      });
      fetchSemuaObat(); // Refresh data setelah update
    } catch (err) {
      alert('Gagal mengubah status');
      console.error(err);
    }
  };

  const jumlahResepUnik = new Set(
    semuaObat
      .filter(item => {
        const tglOk = filterByTanggal(item.tanggal);
        const keyword = searchKeyword.toLowerCase();

        const matchKeyword =
          item.nama_obat.toLowerCase().includes(keyword) ||
          item.rekam_medis?.nama_pasien?.toLowerCase().includes(keyword) ||
          String(item.no_rm).includes(keyword);

        return tglOk && matchKeyword;
      })
      .map(item => item.no_rm)
  ).size;



  return (
    <div className="p-4">
      {isAdmin && (
  <>
    {/* FAB Floating Button */}
    <button
      className="btn btn-primary rounded-circle shadow position-fixed d-flex justify-content-center align-items-center"
      style={{
        bottom: '30px',
        right: '20px',
        width: '60px',
        height: '60px',
        fontSize: '1.5rem',
        zIndex: 1050
      }}
      data-bs-toggle="modal"
      data-bs-target="#formModal"
      aria-label="Tambah"
    >
      +
    </button>

    {/* Modal Form */}
    <div className="modal fade" id="formModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Formulir Copy Resep ke KF</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleCekRM} className="row g-2">
              <div className="col-12">
                <input
                  type="text"
                  value={noRM}
                  onChange={e => setNoRM(e.target.value)}
                  placeholder="Masukkan No RM"
                  required
                  className="form-control"
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">
                  Input
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
)}



      {/* Modal tambah pasien */}
      {modalTambahPasien && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pasien belum terdaftar</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setModalTambahPasien(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nama Pasien:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={namaPasien}
                    onChange={e => setNamaPasien(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalTambahPasien(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSimpanPasienBaru}
                >
                  Simpan & Input Obat
                </button>
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Modal input obat */}
      {modalInputObat && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Input Obat untuk Pasien: {namaPasien} (RM: {currentNoRM})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setModalInputObat(false);
                    setNamaObat('');
                    setHarga('');
                    setJumlah(1);
                  }}
                ></button>
              </div>

              <form onSubmit={handleSubmitObat}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nama Obat:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={namaObat}
                      onChange={handleObatChange}
                      onKeyDown={handleObatKeyDown}
                      autoComplete="off"
                      required
                    />
                    {saranObat.length > 0 && (
                      <ul className="list-group mt-2">
                        {saranObat.map((item, idx) => (
                          <li
                            key={idx}
                            className={`list-group-item ${
                              highlightIndex === idx ? 'active text-white' : ''
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setNamaObat(item.nama_obat);
                              setHarga(item.harga);
                              setSaranObat([]);
                            }}
                          >
                            {item.nama_obat} ({item.harga})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Harga:</label>
                    <input type="number" className="form-control" value={harga} readOnly />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Jumlah:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={jumlah}
                      onChange={e => setJumlah(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Simpan Obat
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setModalInputObat(false);
                      setNamaObat('');
                      setHarga('');
                      setJumlah(1);
                    }}
                  >
                    Selesai
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      )}

      {modalEditObat && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Obat</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalEditObat(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nama Obat</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataEdit.nama_obat}
                    onChange={(e) =>
                      setDataEdit({ ...dataEdit, nama_obat: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    value={dataEdit.harga}
                    onChange={(e) =>
                      setDataEdit({ ...dataEdit, harga: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    className="form-control"
                    value={dataEdit.jumlah}
                    onChange={(e) =>
                      setDataEdit({ ...dataEdit, jumlah: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalEditObat(false)}
                >
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleSimpanEdit}>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


     <h3 className="fw-bold mb-3">Data Obat</h3>

      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-3">
          <label htmlFor="startDate" className="form-label">Dari Tanggal:</label>
          <input
            id="startDate"
            type="date"
            className="form-control"
            value={tanggalAwal}
            onChange={e => setTanggalAwal(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="endDate" className="form-label">Hingga Tanggal:</label>
          <input
            id="endDate"
            type="date"
            className="form-control"
            value={tanggalAkhir}
            onChange={e => setTanggalAkhir(e.target.value)}
          />
        </div>
      </div>


      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama obat / pasien / No RM"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6 d-flex align-items-center gap-2">
          <label className="form-label mb-0">Urutkan:</label>
          <select
            className="form-select"
            style={{ maxWidth: '200px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="tanggal">Tanggal</option>
            <option value="nama_pasien">Nama Pasien</option>
            <option value="jumlah">Jumlah</option>
            <option value="harga">Harga</option>
          </select>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setSortAsc(!sortAsc)}
            title="Balikkan arah urutan"
          >
            {sortAsc ? '⬆️ A-Z' : '⬇️ Z-A'}
          </button>
        </div>
      </div>

      <div className="mb-2">
        <strong>Jumlah Resep (unik berdasarkan No RM): {jumlahResepUnik}</strong>
      </div>
      
<div class="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark text-center align-middle">
          <tr>
            <th>No RM</th>
            <th>Nama Pasien</th>
            <th>Nama Obat</th>
            <th>Jumlah</th>
            <th>Harga</th>
            <th>Tanggal</th>
            <th>Status</th>
            {isAdmin && (
            <th>Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {semuaObat
            .filter(item => {
              const tglOk = filterByTanggal(item.tanggal);
              const keyword = searchKeyword.toLowerCase();

              const matchKeyword =
                item.nama_obat.toLowerCase().includes(keyword) ||
                item.rekam_medis?.nama_pasien?.toLowerCase().includes(keyword) ||
                String(item.no_rm).includes(keyword);

              return tglOk && matchKeyword;
            })

            .sort((a, b) => {
              let valA, valB;

              switch (sortBy) {
                case 'tanggal':
                  valA = new Date(a.tanggal);
                  valB = new Date(b.tanggal);
                  break;
                case 'nama_pasien':
                  valA = a.rekam_medis?.nama_pasien?.toLowerCase() || '';
                  valB = b.rekam_medis?.nama_pasien?.toLowerCase() || '';
                  break;
                case 'jumlah':
                  valA = a.jumlah;
                  valB = b.jumlah;
                  break;
                case 'harga':
                  valA = a.harga * a.jumlah;
                  valB = b.harga * b.jumlah;
                  break;
                default:
                  valA = 0;
                  valB = 0;
              }

              if (valA < valB) return sortAsc ? -1 : 1;
              if (valA > valB) return sortAsc ? 1 : -1;
              return 0;
            })

            .map((item, index) => (
              <tr key={index}>
                <td>{item.no_rm}</td>
                <td>{item.rekam_medis?.nama_pasien || '-'}</td>
                <td>{item.nama_obat}</td>
                <td>{item.jumlah}</td>
                <td>Rp {parseFloat(item.harga * item.jumlah).toLocaleString('id-ID')}</td>
                <td>{new Date(item.tanggal).toLocaleString()}</td>
                <td>
                  <button
                    className={`btn btn-sm ${item.sudah_diserahkan ? 'btn-success' : 'btn-warning text-dark'}`}
                    onClick={() => toggleStatusDiserahkan(item.id, item.sudah_diserahkan)}
                  >
                    {item.sudah_diserahkan ? 'Diserahkan' : 'Belum'}
                  </button>
                </td>
                {isAdmin && (
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => bukaModalEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleHapusObat(item.id)}
                  >
                    Hapus
                  </button>
                </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
</div>

    </div>
  );
}

export default FormCopyResep;
