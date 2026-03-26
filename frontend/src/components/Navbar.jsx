import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Bell } from "lucide-react";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.jpg";

const Navbar = ({ user: propUser, onLogout }) => {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();

  const user = propUser || contextUser;
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    if (query.includes("amazon") || query.includes("flipkart")) {
      navigate(`/add-product?url=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search?q=${query}`);
    }

    setShowDropdown(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-yellow-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-3"
        >
          <img
            src={logo}
            alt="BargainIt logo"
            className="h-10 w-10 rounded-xl object-contain bg-white"
          />
          <h1 className="text-xl font-bold text-slate-900">BargainIt</h1>
        </div>

        <form onSubmit={handleSubmit} className="relative mx-8 flex-1">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search or paste product link..."
            className="w-full rounded-full border border-yellow-200 bg-white pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-400"
          />

          {showDropdown && query && (
            <div className="absolute mt-2 w-full rounded-xl border bg-white p-3 shadow-lg">
              <p
                onClick={() => navigate(`/search?q=${query}`)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                Search "{query}"
              </p>

              {(query.includes("amazon") || query.includes("flipkart")) && (
                <p
                  onClick={() =>
                    navigate(`/add-product?url=${encodeURIComponent(query)}`)
                  }
                  className="cursor-pointer p-2 text-yellow-600 hover:bg-gray-100"
                >
                  Track this product
                </p>
              )}
            </div>
          )}
        </form>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Bell className="cursor-pointer text-slate-700" />

              <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-slate-700">
                <User size={16} />
                {user.name}
              </div>

              <button
                onClick={handleLogout}
                className="flex gap-2 rounded-xl bg-black px-4 py-2 text-white"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-black px-5 py-2 text-white"
              >
                Sign Up
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border px-5 py-2"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
