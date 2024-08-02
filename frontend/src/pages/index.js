import { useRouter } from "next/router";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <main className="flex min-h-screen">
      <div className="w-1/2 bg-indigo-900 flex items-start justify-start p-8">
        <h1 className="text-white text-2xl font-bold">AAK Cloud Services</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="border border-gray-300 p-8 rounded-lg bg-white shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Welcome</h1>
          <p className="text-gray-600 mb-4">Choose an option to proceed</p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleLogin}
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
