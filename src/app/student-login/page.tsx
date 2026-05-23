"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok && result.status) {
        localStorage.setItem("student_session_token", result.token);
        localStorage.setItem("student_data", result.user ? JSON.stringify(result.user) : "");
        console.log("Login successful, token stored in localStorage:", result.token);
        setTimeout(function () {
          router.push("/student/dashboard");
        }, 3000);
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div
          className="rounded-t-3xl p-8 text-center shadow-lg"
          style={{
            background:
              "linear-gradient(to right, var(--primary-light-blue), var(--secondary-light-blue))",
          }}
        >
          <div className="mb-4">
            <div className="inline-block bg-white bg-opacity-30 p-4 rounded-full">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Journal App</h2>
          <p className="text-white text-opacity-90 text-sm">Masuk ke Admin</p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-b-3xl p-8 shadow-xl border-t-4"
          style={{ borderColor: "var(--accent-light-blue)" }}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-6 flex items-start">
              <svg
                className="w-5 h-5 mr-3 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  style={{ color: "var(--accent-light-blue)" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Masukkan username Anda"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent outline-none transition-all duration-300 hover:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  style={{ color: "var(--accent-light-blue)" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=""
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent outline-none transition-all duration-300 hover:border-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(to right, var(--accent-light-blue), var(--secondary-light-blue))",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="2"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 pt-6 border-t border-gray-200">
            © {new Date().getFullYear()} Journal App • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
