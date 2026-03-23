import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__brand">
            <span className="header__logo">R&amp;M</span>
            {/* <span className="header__title">Rick &amp; Morty Characters</span> */}
          </Link>
          <div className="header__nav">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;
