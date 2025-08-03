
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FormCopyResep from './FormCopyResep';

import RekapSaldo from './RekapSaldo';

import TotalObatPerHari from './TotalObatPerHari';

import SerahTerimaObat from './SerahTerimaObat';

import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

import UbahPassword from './UbahPassword';

import Hero from './Hero';

import clsx from "clsx";

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray/20 backdrop-blur-sm rounded-full border-t w-full md:w-1/2 mx-auto shadow-md">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/copyResep"
          className={clsx(
            "flex flex-col items-center justify-center text-center transition-colors duration-200 text-gray-500 hover:text-blue-500",
            isActive("/copyResep") && "text-blue-600"
          )}
        >
          <img src="/copyresep.png" alt="Copy Resep" className="h-8 w-8 mb-1" />
          <span className="text-xs">Copy Resep</span>
        </Link>

        <Link
          to="/rekap-saldo"
          className={clsx(
            "flex flex-col items-center justify-center text-center transition-colors duration-200 text-gray-500 hover:text-blue-500",
            isActive("/rekap-saldo") && "text-blue-600"
          )}
        >
          <img src="/rekapsaldoobat.png" alt="Rekap Saldo" className="h-8 w-8 mb-1" />
          <span className="text-xs">Rekap Saldo</span>
        </Link>

        <Link
          to="/total-obat"
          className={clsx(
            "flex flex-col items-center justify-center text-center transition-colors duration-200 text-gray-500 hover:text-blue-500",
            isActive("/total-obat") && "text-blue-600"
          )}
        >
          <img src="/rekapobatperhari.png" alt="Total Obat" className="h-8 w-8 mb-1" />
          <span className="text-xs">Total Obat</span>
        </Link>

        <Link
          to="/serah-terima"
          className={clsx(
            "flex flex-col items-center justify-center text-center transition-colors duration-200 text-gray-500 hover:text-blue-500",
            isActive("/serah-terima") && "text-blue-600"
          )}
        >
          <img src="/serahterimaobat.png" alt="Serah Terima" className="h-8 w-8 mb-1" />
          <span className="text-xs">Serah Terima</span>
        </Link>

        <Link
          to="/ganti-password"
          className={clsx(
            "flex flex-col items-center justify-center text-center transition-colors duration-200 text-gray-500 hover:text-blue-500",
            isActive("/ganti-password") && "text-blue-600"
          )}
        >
          <img src="/password.png" alt="Password" className="h-8 w-8 mb-1" />
          <span className="text-xs">Password</span>
        </Link>

        <button
          onClick={() => {
            if (confirm("Yakin ingin logout?")) {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }
          }}
          className="flex flex-col bg-transparent items-center justify-center text-center text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          <img src="/logout.png" alt="Logout" className="h-8 w-8 mb-1" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header
      className="text-white py-4 shadow-lg sticky top-0 z-10"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container mx-auto flex items-center px-4">
        <img
          src="/logo.png"
          alt="SIKUMEL Logo"
          className="h-16 md:h-20 mr-4"
        />
        <div>
          <h1
            className="m-0 font-bold text-2xl md:text-3xl tracking-wide"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            SIKUMEL V.2
          </h1>
          <p className="mb-0 text-sm opacity-90">
            Yuk Ngopi, ngopi resep maksutnya.
          </p>
        </div>
      </div>
    </header>
  );
}

function AppContent() {

  const location = useLocation();
  
  return (
    
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow px-3 pt-3 pb-20 w-full" style={{ maxWidth: '1980px', margin: '0 auto' }}>
          {location.pathname === '/' && <Hero />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/copyResep" element={<ProtectedRoute><FormCopyResep /></ProtectedRoute>} />
            <Route path="/rekap-saldo" element={<ProtectedRoute><RekapSaldo /></ProtectedRoute>} />
            <Route path="/total-obat" element={<ProtectedRoute><TotalObatPerHari /></ProtectedRoute>} />
            <Route path="/serah-terima" element={<ProtectedRoute><SerahTerimaObat /></ProtectedRoute>} />
            <Route
              path="/ganti-password"
              element={
                <ProtectedRoute>
                  <UbahPassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <BottomNav />
      </div>
    
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;
