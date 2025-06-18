import { useEffect, useState } from 'react';

function Hero() {
  const [jam, setJam] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setJam(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatJam = jam.toLocaleTimeString('id-ID', { hour12: false });

  return (
    <div className="hero-container position-relative text-white text-center overflow-hidden">
      <img
        src="/pemandangan.jpg" // Ganti dengan file gambar kamu
        alt="Pemandangan"
        className="img-fluid w-100 h-100 object-fit-cover"
        style={{ aspectRatio: '1 / 1', objectFit: 'cover', filter: 'brightness(60%)' }}
      />

      <div
        className="position-absolute top-50 start-50 translate-middle"
        style={{ zIndex: 2 }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>
          Selamat Datang di <span style={{ color: '#ffd700' }}>SIKUMEL</span>
        </h1>
        <p className="lead mb-4">Ngopi yuk — ngopi resep maksudnya ☕</p>
        <h3 className="display-6">{formatJam}</h3>
      </div>
    </div>
  );
}

export default Hero;
