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
      className="relative text-white text-center overflow-hidden rounded-lg shadow-2xl"
      style={{
        height: 'calc(100vh - 200px)', // Adjust height to be more responsive
        minHeight: '300px',
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(/pemandangan.png)',
          filter: 'brightness(0.6) contrast(1.1)',
          zIndex: 1,
        }}
      />

      <div
        className="relative flex flex-col justify-center items-center h-full p-4"
        style={{ zIndex: 2 }}
      >
        <h1 className="font-extrabold text-4xl md:text-5xl mb-3 tracking-tight text-shadow-lg">
          Selamat Datang di <span className="text-yellow-300">SIKUMEL</span>
        </h1>
        <p className="text-lg md:text-xl mb-4 text-shadow-md">Ngopi yuk — ngopi resep maksudnya ☕</p>
        <h3 className="text-5xl md:text-6xl font-mono font-bold tracking-wider text-shadow-xl">{formatJam}</h3>
      </div>
    </div>
  );
}

export default Hero;
