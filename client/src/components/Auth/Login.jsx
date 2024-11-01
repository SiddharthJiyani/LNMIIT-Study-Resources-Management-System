import React, { useState } from "react";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { cn } from "@/lib/utils";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
const BACKEND = import.meta.env.VITE_BACKEND_URL;




export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    toast.loading('Logging in...');
    e.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    console.log("BACKEND", BACKEND);

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();
      const token = data.token;
      if (response.ok && data.success) {
        toast.dismiss();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem("tokenExpiryTime", Date.now() + 24 * 60 * 60 * 1000); //1 day expiration from login time
        toast.success('Login successful');
        setTimeout(() => {
          navigate('/my-courses');
        }
          , 1000);
      } else {
        toast.dismiss();
        toast.error(data.message || "Login failed. Please try again.");
        console.error("Login error", data.message);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Login error", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" m-7 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
      <Toaster />
      <div className="flex justify-center pt-1 pb-4">
        <img width={200} height={200} src={logo} alt="logo" />
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
          Welcome Back
        </h2>
        <p className="text-neutral-600 text-md max-w-sm mt-2 dark:text-neutral-300 p-2">
          Login to LNMIIT Study Resource Management System
        </p>
      </div>

      {/* {error && <p className="text-red-500 text-center">{error}</p>} Display validation errors */}

      <form className="my-5" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="2xxxxxx@lnmiit.ac.in"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${loading && 'opacity-50 cursor-not-allowed'}`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
      </form>

      <div className="text-center">
        <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-base">
          Don't have an account?{" "}
          <span
            className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold transition-colors duration-200 hover:text-primary-700 dark:hover:text-primary-500 underline"
            onClick={() => navigate("/")}
          >
            Signup
          </span>
        </p>
      </div>

    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
