import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="w-1/2 bg-indigo-900 flex items-start justify-start p-8">
        <h1 className="text-white text-2xl font-bold">AAK Cloud Services</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="border border-gray-300 p-8 rounded-lg bg-white shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <p className="text-gray-600 mb-4">Enter your credentials to access our Cloud Service Provider</p>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
