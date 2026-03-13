import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Styles/Sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "🏠 Dashboard" },
    { path: "/add-product", label: "➕ Add Product" },
    { path: "/add-admin", label: "👤 Add Admin" },
    { path: "/add-order", label: "📦 Add Order" },
    { path: "/all-orders", label: "📋 All Orders" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-heading">⚙️ Admin Dashboard</h2>
      {navItems.map(
        (item) =>
          item.path !== location.pathname && (
            <button
              key={item.path}
              className="sidebar-btn"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          )
      )}
      <button className="sidebar-btn sidebar-logout" onClick={handleLogout}>
        🚪 Logout
      </button>
    </aside>
  );
}