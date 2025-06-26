import { Link, useLocation } from "react-router-dom";
import "./SubNavbar.css";

function SubNavbar({
  activeCategory,
  setActiveCategory,
  searchInputValue,
  handleOnSearchInputChange,
}) {
  const categories = [
    "All Categories",
    "Accessories",
    "Apparel",
    "Books",
    "Snacks",
    "Supplies",
  ];

  const location = useLocation();
  const isPastOrdersPage = location.pathname.startsWith("/past-orders");


  return (
    <nav className="SubNavbar">
      <div className="content">
        <div className="topnav">
          <ul className="pages">
            <li className="home">
              <Link to="/">
                <button>
                  <i
                    className="material-icons"
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  >
                    home
                  </i>
                  Home
                </button>
              </Link>
            </li>
            <li className="pastOrders">
              <Link to="/past-orders">
                <button>
                  <i
                    className="material-icons"
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  >
                    history
                  </i>
                  Past Orders
                </button>
              </Link>
            </li>
          </ul>
        </div>

        {!isPastOrdersPage && (
          <>
            <div className="row">
              <div className="search-bar">
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={searchInputValue}
                  onChange={handleOnSearchInputChange}
                />
                <i className="material-icons">search</i>
              </div>
            </div>

            <div className="row">
              <ul className={`category-menu`}>
                {categories.map((cat) => (
                  <li
                    className={activeCategory === cat ? "is-active" : ""}
                    key={cat}
                  >
                    <button onClick={() => setActiveCategory(cat)}>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default SubNavbar;
