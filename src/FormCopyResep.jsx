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
  const [obatSering, setObatSering] = useState([]);
  const [jumlahSnippets, setJumlahSnippets] = useState([]);
  const [snippetObatIndex, setSnippetObatIndex] = useState(-1);
  const [snippetJumlahIndex, setSnippetJumlahIndex] = useState(-1);

  const today = new Date().toISOString().split('T')[0];
  const [tanggalAwal, setTanggalAwal] = useState(today);
  const [tanggalAkhir, setTanggalAkhir] = useState(today);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [sortBy, setSortBy] = useState('tanggal');
  const [sortAsc, setSortAsc] = useState(false); // default: descending

  const username = localStorage.getItem('username');
  const isAdmin = username === 'rsudl';

  const [showFabModal, setShowFabModal] = useState(false);
  const [modalEditObat, setModalEditObat] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    id: '',
    nama_obat: '',
    harga: '',
    jumlah: ''
  });

  const API = import.meta.env.VITE_API_URL;

  const fetchObatSering = async () => {
    try {
      const res = await axios.get(`${API}/api/obat-sering`);
      setObatSering(res.data);
    } catch (err) {
      console.error('Gagal ambil obat sering:', err);
    }
  };

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
    fetchObatSering();
  }, [tanggalAwal, tanggalAkhir, searchKeyword]);

  // ✅ Untuk kontrol backdrop modal
useEffect(() => {
  if (showFabModal || modalTambahPasien) {
    document.body.classList.add('overflow-hidden');
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
    document.body.appendChild(backdrop);
  } else {
    document.body.classList.remove('overflow-hidden');
    document.querySelectorAll('.fixed.inset-0.bg-black.bg-opacity-50.z-40').forEach(el => el.remove());
  }

  return () => {
    document.body.classList.remove('overflow-hidden');
    document.querySelectorAll('.fixed.inset-0.bg-black.bg-opacity-50.z-40').forEach(el => el.remove());
  };
}, [showFabModal, modalTambahPasien]);

  // Keyboard shortcuts: Alt+T = open input, Alt+X = close modal
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        if (isAdmin) {
          setShowFabModal(true);
        }
      }
      if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        if (modalEditObat) {
          setModalEditObat(false);
        } else if (modalInputObat) {
          setModalInputObat(false);
          setNamaObat('');
          setHarga('');
          setJumlah(1);
          setJumlahSnippets([]);
        } else if (modalTambahPasien) {
          setModalTambahPasien(false);
        } else if (showFabModal) {
          setShowFabModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAdmin, modalEditObat, modalInputObat, modalTambahPasien, showFabModal]);





  const handleCekRM = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API}/api/rekam_medis/${noRM}`);
      setNamaPasien(res.data.nama_pasien);
      setCurrentNoRM(noRM);
      setModalInputObat(true);
      fetchObatSering();
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

  const handleSelectSnippetObat = (item) => {
    setNamaObat(item.nama_obat);
    setHarga(item.harga);
    setSaranObat([]);
    setSnippetObatIndex(-1);
    // Set jumlah snippets for this medicine
    setJumlahSnippets(item.top_jumlah || []);
    setSnippetJumlahIndex(-1);
  };

  const handleSelectSnippetJumlah = (val) => {
    setJumlah(val);
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
    // Update jumlah snippets when medicine name changes
    const matchedFrequent = obatSering.find(o => o.nama_obat.toLowerCase() === val.toLowerCase());
    if (matchedFrequent) {
      setJumlahSnippets(matchedFrequent.top_jumlah || []);
    } else {
      setJumlahSnippets([]);
    }
  };

  const handleObatKeyDown = (e) => {
    // Arrow navigation for obat snippet chips (when field is empty)
    if (saranObat.length === 0 && !namaObat && obatSering.length > 0) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSnippetObatIndex(prev => (prev + 1) % obatSering.length);
        return;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSnippetObatIndex(prev => (prev - 1 + obatSering.length) % obatSering.length);
        return;
      } else if (e.key === 'Enter' && snippetObatIndex >= 0) {
        e.preventDefault();
        handleSelectSnippetObat(obatSering[snippetObatIndex]);
        return;
      }
    }

    // Arrow navigation for autocomplete suggestions
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
      // Update jumlah snippets
      const matchedFrequent = obatSering.find(o => o.nama_obat.toLowerCase() === selected.nama_obat.toLowerCase());
      if (matchedFrequent) {
        setJumlahSnippets(matchedFrequent.top_jumlah || []);
      }
      e.preventDefault();
    }
  };

  const handleJumlahKeyDown = (e) => {
    if (jumlahSnippets.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSnippetJumlahIndex(prev => (prev + 1) % jumlahSnippets.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSnippetJumlahIndex(prev => (prev - 1 + jumlahSnippets.length) % jumlahSnippets.length);
    } else if (e.key === 'Enter' && snippetJumlahIndex >= 0) {
      e.preventDefault();
      handleSelectSnippetJumlah(jumlahSnippets[snippetJumlahIndex]);
    }
  };

  const handleSubmitObat = async (e) => {
    e.preventDefault();

    const obatIsValid = dataObat.some(o => o.nama_obat.toLowerCase() === namaObat.toLowerCase());
    if (!obatIsValid) {
      alert('Nama obat tidak valid. Harap pilih dari daftar yang tersedia.');
      return;
    }

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
      setJumlahSnippets([]);
      fetchSemuaObat();
      fetchObatSering();
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



  const bukaModalEdit = (item) => {
    setDataEdit({
      id: item.id,
      nama_obat: item.nama_obat,
      harga: item.harga,
      jumlah: item.jumlah
    });
    setSaranObat([]);
    setModalEditObat(true);
  };

  const handleEditObatChange = (e) => {
    const val = e.target.value;
    setDataEdit({ ...dataEdit, nama_obat: val });

    if (val.length >= 2) {
      const filter = dataObat.filter(o => o.nama_obat.toLowerCase().includes(val.toLowerCase()));
      setSaranObat(filter);
      setHighlightIndex(-1);
    } else {
      setSaranObat([]);
    }
  };

  const handleSimpanEdit = async () => {
    const obatIsValid = dataObat.some(o => o.nama_obat.toLowerCase() === dataEdit.nama_obat.toLowerCase());
    if (!obatIsValid) {
      alert('Nama obat tidak valid. Harap pilih dari daftar yang tersedia.');
      return;
    }

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
    {/* Floating Action Button */}
    <button
      className="bg-blue-500 text-white rounded-full shadow-lg fixed flex justify-center items-center"
      style={{
        bottom: '30px',
        right: '20px',
        width: '60px',
        height: '60px',
        fontSize: '1.5rem',
        zIndex: 1050
      }}
      onClick={() => setShowFabModal(true)}
      aria-label="Tambah"
    >
      +
    </button>

    {/* Modal FAB pakai React state */}
    {showFabModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="p-4 border-b">
            <h5 className="text-lg font-bold">Formulir Copy Resep ke KF</h5>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              aria-label="Close"
              onClick={() => setShowFabModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <form
              onSubmit={(e) => {
                handleCekRM(e);
                setShowFabModal(false); // Tutup setelah submit
              }}
              className="grid grid-cols-1 gap-2"
            >
              <div className="col-span-1">
                <input
                  type="text"
                  value={noRM}
                  onChange={e => setNoRM(e.target.value)}
                  placeholder="Masukkan No RM"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="col-span-1 text-right">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Input
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </>
)}




      {/* Modal tambah pasien */}
      {modalTambahPasien && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="p-4 border-b">
              <h5 className="text-lg font-bold">Pasien belum terdaftar</h5>
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                aria-label="Close"
                onClick={() => setModalTambahPasien(false)}
              >&times;</button>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="block mb-1">Nama Pasien:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={namaPasien}
                  onChange={e => setNamaPasien(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setModalTambahPasien(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSimpanPasienBaru}
              >
                Simpan & Input Obat
              </button>
            </div>
          </div>
        </div>

      )}

      {/* Modal input obat */}
      {modalInputObat && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="p-4 border-b">
              <h5 className="text-lg font-bold">
                Input Obat untuk Pasien: {namaPasien} (RM: {currentNoRM})
              </h5>
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                aria-label="Close"
                onClick={() => {
                  setModalInputObat(false);
                  setNamaObat('');
                  setHarga('');
                  setJumlah(1);
                  setJumlahSnippets([]);
                }}
              >&times;</button>
            </div>

            <form onSubmit={handleSubmitObat} style={{ flex: 1, overflow: 'auto' }}>
              <div className="p-4">

                {/* Snippet obat sering - floating cloud */}
                {obatSering.length > 0 && !namaObat && (
                  <div style={{
                    marginBottom: '12px',
                    padding: '8px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f4fd 100%)',
                    borderRadius: '10px',
                    border: '1px solid #bde0fe'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#64748b',
                      marginBottom: '6px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>⚡ Obat terakhir dipakai</div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {obatSering.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSnippetObat(item)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '999px',
                            border: snippetObatIndex === idx ? '1px solid #3b82f6' : '1px solid #93c5fd',
                            background: snippetObatIndex === idx ? '#3b82f6' : 'rgba(255,255,255,0.85)',
                            color: snippetObatIndex === idx ? '#fff' : '#1e40af',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: '500',
                            lineHeight: '1.4',
                            whiteSpace: 'nowrap',
                            backdropFilter: 'blur(4px)',
                            boxShadow: snippetObatIndex === idx ? '0 3px 8px rgba(59,130,246,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                            transform: snippetObatIndex === idx ? 'translateY(-1px)' : 'translateY(0)'
                          }}
                          onMouseEnter={e => {
                            e.target.style.background = '#3b82f6';
                            e.target.style.color = '#fff';
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 3px 8px rgba(59,130,246,0.3)';
                          }}
                          onMouseLeave={e => {
                            if (snippetObatIndex !== idx) {
                              e.target.style.background = 'rgba(255,255,255,0.85)';
                              e.target.style.color = '#1e40af';
                              e.target.style.borderColor = '#93c5fd';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                            }
                          }}
                        >
                          {item.nama_obat}
                          <span style={{
                            marginLeft: '4px',
                            fontSize: '10px',
                            opacity: 0.7
                          }}>({item.count}×)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="block mb-1">Nama Obat:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={namaObat}
                    onChange={handleObatChange}
                    onKeyDown={handleObatKeyDown}
                    autoComplete="off"
                    required
                  />
                  {saranObat.length > 0 && (
                    <ul className="mt-2 border rounded-md" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {saranObat.map((item, idx) => (
                        <li
                          key={idx}
                          className={`p-2 cursor-pointer ${
                            highlightIndex === idx ? 'bg-blue-500 text-white' : ''
                          }`}
                          onClick={() => {
                            setNamaObat(item.nama_obat);
                            setHarga(item.harga);
                            setSaranObat([]);
                            const matchedFrequent = obatSering.find(o => o.nama_obat.toLowerCase() === item.nama_obat.toLowerCase());
                            if (matchedFrequent) {
                              setJumlahSnippets(matchedFrequent.top_jumlah || []);
                            }
                          }}
                        >
                          {item.nama_obat} ({item.harga})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block mb-1">Harga:</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md bg-gray-100" value={harga} readOnly />
                </div>

                <div className="mb-3">
                  <label className="block mb-1">Jumlah:</label>

                  {/* Jumlah snippets - shown when medicine is selected */}
                  {jumlahSnippets.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '8px'
                    }}>
                      {jumlahSnippets.map((val, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSnippetJumlah(val)}
                          style={{
                            padding: '3px 12px',
                            fontSize: '12px',
                            borderRadius: '999px',
                            border: (jumlah == val || snippetJumlahIndex === idx) ? '2px solid #10b981' : '1px solid #a7f3d0',
                            background: jumlah == val ? '#10b981' : snippetJumlahIndex === idx ? '#34d399' : 'rgba(236,253,245,0.9)',
                            color: (jumlah == val || snippetJumlahIndex === idx) ? '#fff' : '#065f46',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: '600',
                            minWidth: '36px',
                            textAlign: 'center',
                            boxShadow: jumlah == val ? '0 2px 6px rgba(16,185,129,0.3)' : snippetJumlahIndex === idx ? '0 3px 8px rgba(52,211,153,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                            transform: snippetJumlahIndex === idx ? 'translateY(-1px)' : 'translateY(0)'
                          }}
                          onMouseEnter={e => {
                            if (jumlah != val) {
                              e.target.style.background = '#34d399';
                              e.target.style.color = '#fff';
                              e.target.style.borderColor = '#34d399';
                              e.target.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (jumlah != val) {
                              e.target.style.background = 'rgba(236,253,245,0.9)';
                              e.target.style.color = '#065f46';
                              e.target.style.borderColor = '#a7f3d0';
                              e.target.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={jumlah}
                    onChange={e => setJumlah(e.target.value)}
                    onKeyDown={handleJumlahKeyDown}
                    required
                  />
                </div>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Simpan Obat
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                  onClick={() => {
                    setModalInputObat(false);
                    setNamaObat('');
                    setHarga('');
                    setJumlah(1);
                    setJumlahSnippets([]);
                  }}
                >
                  Selesai
                </button>
              </div>
            </form>
          </div>
        </div>

      )}

      {modalEditObat && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="p-4 border-b">
              <h5 className="text-lg font-bold">Edit Obat</h5>
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setModalEditObat(false)}
              >&times;</button>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="block mb-1">Nama Obat</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={dataEdit.nama_obat}
                  onChange={handleEditObatChange}
                  onKeyDown={(e) => {
                    if (saranObat.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      setHighlightIndex(prev => (prev + 1) % saranObat.length);
                    } else if (e.key === 'ArrowUp') {
                      setHighlightIndex(prev => (prev - 1 + saranObat.length) % saranObat.length);
                    } else if (e.key === 'Enter' && highlightIndex >= 0) {
                      const selected = saranObat[highlightIndex];
                      setDataEdit({
                        ...dataEdit,
                        nama_obat: selected.nama_obat,
                        harga: selected.harga
                      });
                      setSaranObat([]);
                      e.preventDefault();
                    }
                  }}
                  autoComplete="off"
                />
                {saranObat.length > 0 && (
                  <ul className="mt-2 border rounded-md">
                    {saranObat.map((item, idx) => (
                      <li
                        key={idx}
                        className={`p-2 cursor-pointer ${
                          highlightIndex === idx ? 'bg-blue-500 text-white' : ''
                        }`}
                        onClick={() => {
                          setDataEdit({
                            ...dataEdit,
                            nama_obat: item.nama_obat,
                            harga: item.harga
                          });
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
                <label className="block mb-1">Harga</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  value={dataEdit.harga}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Jumlah</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={dataEdit.jumlah}
                  onChange={(e) =>
                    setDataEdit({ ...dataEdit, jumlah: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setModalEditObat(false)}
              >
                Batal
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSimpanEdit}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}


     <h3 className="font-bold mb-3">Data Obat</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mb-3">
        <div className="col-span-1">
          <label htmlFor="startDate" className="block mb-1">Dari Tanggal:</label>
          <input
            id="startDate"
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={tanggalAwal}
            onChange={e => setTanggalAwal(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="endDate" className="block mb-1">Hingga Tanggal:</label>
          <input
            id="endDate"
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={tanggalAkhir}
            onChange={e => setTanggalAkhir(e.target.value)}
          />
        </div>
      </div>


      <div className="mb-3">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Cari nama obat / pasien / No RM"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full md:w-1/2 flex items-center gap-2">
          <label className="mb-0">Urutkan:</label>
          <select
            className="px-3 py-2 border rounded-md"
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
            className="px-2 py-1 border rounded-md text-sm"
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
      
<div class="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-800 text-white text-center align-middle">
          <tr>
            <th className="py-2 px-4">No RM</th>
            <th className="py-2 px-4">Nama Pasien</th>
            <th className="py-2 px-4">Nama Obat</th>
            <th className="py-2 px-4">Jumlah</th>
            <th className="py-2 px-4">Harga</th>
            <th className="py-2 px-4">Tanggal</th>
            <th className="py-2 px-4">Status</th>
            {isAdmin && (
            <th className="py-2 px-4">Aksi</th>
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
                <td className="border px-4 py-2">{item.no_rm}</td>
                <td className="border px-4 py-2">{item.rekam_medis?.nama_pasien || '-'}</td>
                <td className="border px-4 py-2">{item.nama_obat}</td>
                <td className="border px-4 py-2">{item.jumlah}</td>
                <td className="border px-4 py-2">Rp {parseFloat(item.harga * item.jumlah).toLocaleString('id-ID')}</td>
                <td className="border px-4 py-2">{new Date(item.tanggal).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button
                    className={`px-2 py-1 text-sm rounded ${item.sudah_diserahkan ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}`}
                    onClick={() => toggleStatusDiserahkan(item.id, item.sudah_diserahkan)}
                  >
                    {item.sudah_diserahkan ? 'Diserahkan' : 'Belum'}
                  </button>
                </td>
                {isAdmin && (
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => bukaModalEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
