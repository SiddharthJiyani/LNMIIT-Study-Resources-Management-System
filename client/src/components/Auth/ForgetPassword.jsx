import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@lnmiit.ac.in")) {
      toast.error("Please enter a valid LNMIIT email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password reset email sent successfully.");
        // navigate('/login') issue in toaster
      } else {
        toast.error(data.message || "Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-7 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
      <Toaster />
      <div className="flex justify-center pt-1 pb-4">
        <img width={200} height={200} src={logo} alt="logo" />
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
          Forgot Password
        </h2>
        <p className="text-neutral-600 text-md max-w-sm mt-2 dark:text-neutral-300 p-2">
          Enter your LNMIIT email to receive a password reset link.
        </p>
      </div>

      <form className="my-5" onSubmit={handleSubmit}>
        <div className="mb-8">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="2xxxxxx@lnmiit.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            required
          />
        </div>

        <button
          className={`bg-gradient-to-br from-black dark:from-zinc-900 to-neutral-600 dark:to-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] ${loading && 'opacity-50 cursor-not-allowed'}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending email..." : "Send Reset Link"}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
      </form>

      <div className="text-center">
        <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-base">
          Remembered your password?{" "}
          <span
            className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold transition-colors duration-200 hover:text-primary-700 dark:hover:text-primary-500 underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
