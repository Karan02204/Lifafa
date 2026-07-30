import GoogleButton from "./GoogleButton";

export default function LoginCard() {
  return (
    <div
      className="
        w-full
        max-w-sm
        rounded-xl
        border
        border-gray-200
        bg-white
        px-8
        py-8
        shadow-sm
      "
    >
      <h1 className="text-center text-4xl font-bold text-gray-900">Login</h1>

      <div className="mt-7">
        <GoogleButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />

        <span className="text-xs text-gray-400">or sign up through email</span>

        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email ID"
          className="
            w-full
            rounded-lg
            bg-gray-100
            px-4
            py-3
            text-sm
            outline-none
          "
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            rounded-lg
            bg-gray-100
            px-4
            py-3
            text-sm
            outline-none
          "
        />

        <button
          className="
            w-full
            rounded-lg
            bg-green-600
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-green-700
          "
        >
          Login
        </button>
      </form>
    </div>
  );
}
