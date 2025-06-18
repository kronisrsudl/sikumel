import { useEffect, useState } from 'react';

function Hero() {
  const [jam, setJam] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setJam(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatJam = jam.toLocaleTimeString('id-ID', { hour12: false });

  return (
    <div
      className="hero-container position-relative text-white text-center overflow-hidden"
      style={{
        maxHeight: '480px', // 🔸 BATAS MAKSIMAL TINGGI
        height: '100vh',     // agar tetap penuh di layar kecil
      }}
    >
      <img
        src="/pemandangan.png"
        alt="Pemandangan"
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          objectFit: 'cover',
          filter: 'brightness(60%)',
          zIndex: 1,
        }}
      />

      <div
        className="position-relative d-flex flex-column justify-content-center align-items-center h-100"
        style={{ zIndex: 2 }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>
          Selamat Datang di <span style={{ color: '#ffd700' }}>SIKUMEL</span>
        </h1>
        <p className="lead mb-3">Ngopi yuk — ngopi resep maksudnya ☕</p>
        <h3 className="display-6">{formatJam}</h3>
      </div>
    </div>
  );
}

export default Hero;
