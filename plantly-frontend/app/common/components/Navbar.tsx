import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "~/auth/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  return (
    <>
      <nav className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl"
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* App Title */}
        <Link to="/" className="text-xl font-bold text-green-700 hidden md:block">
          Plantly
        </Link>
      </nav>

      {isOpen && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "backdrop-blur-sm bg-black/30" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-md p-6 z-50 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="mb-4 text-2xl"
              aria-label="Close Menu"
            >
              ✕
            </button>
            <NavLinks onLinkClick={() => setIsOpen(false)} isAdmin={isAdmin} />
          </div>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col items-center bg-white shadow-md h-screen fixed top-0 left-0 z-30 transition-all duration-300 ${
          isHovered ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center h-16">
          <Link
            to="/"
            className={`text-3xl font-bold text-green-700 transform ${
              isHovered ? "rotate-0" : "-rotate-20"
            } transition-transform duration-300`}
          >
            🌱
          </Link>
        </div>
        <nav className="flex-1 mt-4">
          <NavLinks isExpanded={isHovered} isAdmin={isAdmin}/>
        </nav>
      </aside>

      <div className="hidden md:block" style={{ marginLeft: isHovered ? 256 : 80 }}></div>
    </>
  );
}

function NavLinks({ onLinkClick, isExpanded, isAdmin }: { onLinkClick?: () => void; isExpanded?: boolean; isAdmin?: boolean }) {
  const linkClasses = "flex items-center gap-4 p-2 my-2 text-gray-700 hover:bg-green-100 rounded-md transition-colors duration-200";

  // Replace "🌱" with real icons later
  const links = [
    { to: "/overview", label: "Overview", icon: "🏠" },
    { to: "/myplants", label: "My Plants", icon: "🪴" },
    { to: "/add", label: "Add Plant", icon: "➕" },
    { to: "/care-log", label: "Care Log", icon: "🧪" },
    { to: "/reminders", label: "Reminders", icon: "⏰" },
    { to: "/species-guide", label: "Species Guide", icon: "🔍" },
    { to: "/settings", label: "Settings", icon: "⚙️" },

  ];

  if (isAdmin) {
    links.push(
      { to: "/admin/species", label: "Admin", icon: "⚙️" },
    )
  }

  return (
    <div className="flex flex-col px-2">
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? "underline" : ""}`
          }
          onClick={onLinkClick}
        >
          <span className="text-xl">{icon}</span>
          {isExpanded && <span className="text-base">{label}</span>}
        </NavLink>
      ))}
    </div>
  );
}