import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import StreamListPage from "./pages/StreamListPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar cartCount={0} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<StreamListPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<StreamListPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        EZTechMovie · StreamList — INT499 Course Project, Week 4
      </footer>
    </div>
  );
}

export default App;
