import { NavLink } from "react-router-dom";
import { FilmIcon, ListIcon, ClapperIcon, CartIcon, InfoIcon } from "./Icons.jsx";

/*
  Top navigation — the "marquee". Every route in the app is reachable
  from here so the menu system flows seamlessly between pages.
*/
function Navbar({ cartCount = 0 }) {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" style={{ alignItems: "center" }}>
          <span className="brand-mark">
            <FilmIcon stroke="white" />
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
                <ListIcon />
                <span>StreamList</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" className={linkClass}>
                <ClapperIcon />
                <span>Movies</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={linkClass}>
                <CartIcon />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClass}>
                <InfoIcon />
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
