
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FormCopyResep from './FormCopyResep';

import RekapSaldo from './RekapSaldo';

import TotalObatPerHari from './TotalObatPerHari';

import SerahTerimaObat from './SerahTerimaObat';

import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

import UbahPassword from './UbahPassword';

import Hero from './Hero';

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar fixed-bottom navbar-light bg-white border-top shadow-sm">
      <div className="container-fluid d-flex justify-content-around px-2">
        <Link to="/copyResep" className={`nav-link text-center ${isActive('/copyResep') ? 'text-primary fw-bold' : ''}`}>
          <div><img src="/copyresep.png" alt="Copy Resep" style={{ height: 36 }} /></div>
          
        </Link>
        <Link to="/rekap-saldo" className={`nav-link text-center ${isActive('/rekap-saldo') ? 'text-primary fw-bold' : ''}`}>
          <div><img src="/rekapsaldoobat.png" alt="Rekap Saldo Obat" style={{ height: 36 }} /></div>
          
        </Link>
        <Link to="/total-obat" className={`nav-link text-center ${isActive('/total-obat') ? 'text-primary fw-bold' : ''}`}>
          <div><img src="rekapobatperhari.png" alt="Total Obat Per Hari" style={{ height: 36 }} /></div>
          
        </Link>
        <Link to="/serah-terima" className={`nav-link text-center ${isActive('/serah-terima') ? 'text-primary fw-bold' : ''}`}>
          <div><img src="/serahterimaobat.png" alt="Serah Terima Obat" style={{ height: 36 }} /></div>
        
        </Link>
        <Link to="/ganti-password" className={`nav-link text-center ${isActive('/ganti-password') ? 'text-primary fw-bold' : ''}`}>
          <div><img src="/password.png" alt="Password" style={{ height: 36 }} /></div>
        
        </Link>
        <Link
          to="#"
          className="nav-link text-center"
          onClick={() => {
            if (confirm('Yakin ingin logout?')) {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          }}
        >
          <div><img src="/logout.png" alt="Copy Resep" style={{ height: 36 }} /></div>
          
        </Link>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header
      className="text-white py-3 shadow-sm sticky-top"
      style={{
        background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
      }}
    >
      <div className="container d-flex align-items-center">
        <img
          src="/logo.png"
          alt="SIKUMEL Logo"
          style={{ height: '120px', marginRight: '1rem' }}
        />
        <div>
          <h1
            className="m-0 fw-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.75rem',
              letterSpacing: '0.5px',
            }}
          >
            SIKUMEL V.2
          </h1>
          <p className="mb-0" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Yuk Ngopi, ngopi resep maksutnya.
          </p>
        </div>
      </div>
    </header>


  );
}

function App() {

  const location = useLocation();
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-fill px-3 pt-3 pb-5 w-100" style={{ maxWidth: '1980px', margin: '0 auto' }}>
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
    </Router>
  );
}

export default App;
