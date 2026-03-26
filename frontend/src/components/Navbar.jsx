import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Bell, Menu, X } from "lucide-react";
import { useAuth } from "../context/useAuth";
import logo from "../assets/logo.jpg";

const Navbar = ({ user: propUser, onLogout }) => {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();

  const user = propUser || contextUser;
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const normalizedQuery = query.trim();
    const isProductLink =
      normalizedQuery.includes("amazon") || normalizedQuery.includes("flipkart");

    if (isProductLink) {
      navigate(`/dashboard?add=1&url=${encodeURIComponent(normalizedQuery)}`);
    } else {
      navigate(`/dashboard?q=${encodeURIComponent(normalizedQuery)}`);
    }

    setQuery("");
    setShowDropdown(false);
    setMobileMenuOpen(false);
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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div
          onClick={() => navigate("/")}
          className="flex min-w-0 cursor-pointer items-center gap-3"
        >
          <img
            src={logo}
            alt="BargainIt logo"
            className="h-10 w-10 rounded-xl object-contain bg-white"
          />
          <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
            BargainIt
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="ml-auto rounded-xl border border-yellow-200 p-2 text-slate-700 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } w-full flex-col gap-4 md:flex md:flex-1 md:flex-row md:items-center md:gap-6`}
        >
          <form onSubmit={handleSubmit} className="relative w-full flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => {
                window.setTimeout(() => setShowDropdown(false), 120);
              }}
              placeholder="Search tracked products or paste a product link..."
              className="w-full rounded-full border border-yellow-200 bg-white py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-yellow-400 sm:text-base"
            />

            {showDropdown && query && (
              <div className="absolute mt-2 w-full rounded-2xl border border-yellow-100 bg-white p-3 shadow-lg">
                <p
                  onMouseDown={() =>
                    navigate(`/dashboard?q=${encodeURIComponent(query.trim())}`)
                  }
                  className="cursor-pointer rounded-xl p-2 text-sm hover:bg-gray-100"
                >
                  Search "{query.trim()}"
                </p>

                {(query.includes("amazon") || query.includes("flipkart")) && (
                  <p
                    onMouseDown={() =>
                      navigate(
                        `/dashboard?add=1&url=${encodeURIComponent(query.trim())}`
                      )
                    }
                    className="cursor-pointer rounded-xl p-2 text-sm text-yellow-600 hover:bg-gray-100"
                  >
                    Track this product
                  </p>
                )}
              </div>
            )}
          </form>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {user ? (
              <>
                <div className="hidden items-center gap-2 text-slate-700 sm:flex">
                  <Bell className="text-slate-700" size={18} />
                  <span className="text-sm font-medium">Alerts</span>
                </div>

                <div className="flex min-w-0 items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-slate-700">
                  <User size={16} />
                  <span className="truncate text-sm font-medium">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-white"
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
      </div>
    </nav>
  );
};

export default Navbar;
