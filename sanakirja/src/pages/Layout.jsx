import { Outlet, Link } from "react-router-dom";
import "../styles/Layout.css";

const Layout = () => {
  return (
    <div className="layoutDiv">
      <header>
        <h1>Dictionary</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/add">Add</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Copyright &copy; Lauri Saarenpää</p>
      </footer>
    </div>
  );
};

export default Layout;
