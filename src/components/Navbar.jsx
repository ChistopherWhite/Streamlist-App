import { NavLink } from "react-router-dom";
import { MdLocalMovies } from "react-icons/md";
import { PiFilmSlateBold, PiPopcornFill, PiShoppingCartSimpleBold, PiInfoBold } from "react-icons/pi";

/*
  Top navigation — the "marquee". Every route in the app is reachable
  from here so the menu system flows seamlessly between pages. Icons
  come from react-icons (Phosphor + Material Design sets), installed
  as a proper npm package rather than one-off SVGs.
*/
function Navbar({ cartCount = 0 }) {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" style={{ alignItems: "center" }}>
          <span className="brand-mark">
            <PiFilmSlateBold color="white" size={19} />
          </span>
          <span className="brand-text">
            <span className="eyebrow">EZTechMovie</span>
            <span className="title">StreamList</span>
          </span>
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={linkClass}>
                <PiPopcornFill size={16} />
                <span>StreamList</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" className={linkClass}>
                <MdLocalMovies size={16} />
                <span>Movies</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={linkClass}>
                <PiShoppingCartSimpleBold size={16} />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClass}>
                <PiInfoBold size={16} />
                <span>About</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

