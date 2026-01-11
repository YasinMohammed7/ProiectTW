import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import { useNavigate } from "react-router";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export const LoginScreen = () => {
  const navigate = useNavigate();

  const { googleLogin, error, setError, isAuthenticated, user } = useAuthStore(
    useShallow((state) => ({
      googleLogin: state.googleLogin,
      isLoading: state.isLoading,
      error: state.error,
      setError: state.setError,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    }))
  );

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setError("");
      await googleLogin(credential);
      navigate("/");
    } catch (err) {
      setError("Autentificarea nu a reușit. Te rugăm să încerci din nou.");
    }
  };

  // Dacă e deja autentificat, arată mesaj de succes
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
        <article className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="text-white size-16" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bine ai revenit!
            </h1>

            {/* User info */}
            <p className="text-gray-600 mb-6">
              Ești autentificat ca <strong>{user.name || user.email}</strong>
            </p>
          </div>
        </article>
      </div>
    );
  }

  // Ecran de login pentru utilizatori neautentificați
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <article className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
        <header className="text-center mb-8">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">TW</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Proiect TW 2026
          </h1>
          <p className="text-gray-600">Autentifică-te pentru a continua</p>
        </header>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Google Login section */}
        <section className="flex flex-col items-center gap-4">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleSuccess(credentialResponse.credential!);
            }}
            onError={() => {
              setError(
                "Autentificarea nu a reușit. Te rugăm să încerci din nou."
              );
            }}
          />

          {/* Info text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Continuând, ești de acord cu{" "}
            <a href="/terms" className="text-purple-600 hover:underline">
              Termenii și Condițiile
            </a>{" "}
            și{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Politica de Confidențialitate
            </a>
          </p>
        </section>
      </article>
    </div>
  );
};
