import { useEffect, useState } from 'react';

function Hero() {
  const [jam, setJam] = useState(new Date());
  const [cuaca, setCuaca] = useState(null);
  const [loadingCuaca, setLoadingCuaca] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setJam(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=id&appid=${API_KEY}`
        );
        const data = await res.json();
        setCuaca({
          kota: data.name,
          suhu: Math.round(data.main.temp),
          deskripsi: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
        setLoadingCuaca(false);
      } catch (err) {
        console.error('Gagal ambil cuaca:', err);
      }
    });
  }, []);

  const formatJam = jam.toLocaleTimeString('id-ID', { hour12: false });

  return (
    <div className="hero-container position-relative text-white text-center overflow-hidden">
      <img
        src="/pemandangan.jpg"
        alt="Pemandangan"
        className="img-fluid w-100 h-100 object-fit-cover"
        style={{ aspectRatio: '1 / 1', objectFit: 'cover', filter: 'brightness(60%)' }}
      />

      <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 2 }}>
        <h1 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>
          Selamat Datang di <span style={{ color: '#ffd700' }}>SIKUMEL</span>
        </h1>
        <p className="lead mb-4">Ngopi yuk — ngopi resep maksudnya ☕</p>
        <h3 className="display-6 mb-3">{formatJam}</h3>

        {/* Cuaca Realtime */}
        {!loadingCuaca && cuaca && (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <img src={cuaca.icon} alt="Icon Cuaca" style={{ width: '50px' }} />
            <div>
              <strong>{cuaca.kota}</strong> <br />
              {cuaca.suhu}°C – {cuaca.deskripsi}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
