import { Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

export const Layout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      logout: state.logout,
    }))
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header semantic */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex justify-between items-center h-16"
            aria-label="Main navigation"
          >
            {/* Logo section */}
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Proiect TW 2026
              </h1>
            </div>

            {/* User section - doar dacă e autentificat */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3">
                {/* User info */}
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg"
                  role="status"
                  aria-label="User information"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold"
                    aria-hidden="true"
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                  aria-label="Deconectare"
                  type="button"
                >
                  <ArrowLeftStartOnRectangleIcon className="size-6" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer optional */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Proiect TW 2026. Toate drepturile
          rezervate.
        </p>
      </footer>
    </div>
  );
};
