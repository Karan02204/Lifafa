import { FcGoogle } from "react-icons/fc";
const API_URL = import.meta.env.VITE_API_URL;

export default function GoogleButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };
  return (
    <button
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-green-50
        py-3
        text-sm
        font-medium
        text-gray-700
        transition
        hover:bg-green-100
      "
      onClick={handleGoogleLogin}
    >
      <FcGoogle size={18} />
      Login with Google
    </button>
  );
}
