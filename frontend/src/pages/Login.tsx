import LoginCard from "@/components/auth/LoginCard";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    // <div className="flex min-h-screen items-center justify-center">
    //   <Button onClick={handleGoogleLogin}>Continue with Google</Button>
    // </div>

    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <LoginCard />
    </main>
  );
}
