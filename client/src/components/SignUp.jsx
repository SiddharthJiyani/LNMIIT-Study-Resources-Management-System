import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/Input";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


export function SignupFormDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To show a loading indicator during form submission

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  //***** NOTE: already getting validated from server , can use this for speeding up and unecessary server requests **********
  // const validateForm = () => {
  //   const { firstname, lastname, email, password, confirmPassword } = formData;

  //   if (!firstname || !lastname || !email || !password || !confirmPassword) {
  //     setError("All fields are required.");
  //     return false;
  //   }

  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@lnmiit\.ac\.in$/; //regex
  //   if (!emailPattern.test(email)) {
  //     setError("Please enter a valid LNMIIT email address.");
  //     return false;
  //   }

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     return false;
  //   }

  //   setError("");
  //   return true;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Signing up...');

    const signupData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      accountType: "student",
      // otp: otpValue,
    };

    console.log(signupData);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.success) {
        toast.dismiss();
        toast.success('Signup successful');
        console.log("Signup successful", data);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.dismiss();
        toast.error(data.message || "Signup failed. Please try again.");
        console.error("Signup error", data.message);
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Signup error", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // 
  return (
    <div className="m-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
      <Toaster />
      <div className="flex justify-center pt-1 pb-6">
        <img width={250} height={250} src={logo} alt="logo" />
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
          Welcome to LNMIIT Study Resource Management System
        </h2>
        <p className="text-neutral-600 text-md max-w-sm mt-2 dark:text-neutral-300 p-2">
          Sign up only if you have LNMIIT domain email address
        </p>
      </div>

      {/* {error && <p className="text-red-500 text-center">{error}</p>} Display validation errors */}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>
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
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <button
          className={` bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${loading && 'opacity-50 cursor-not-allowed'}`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}
      </form>

      <div className="text-center">
        <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-base">
          Already have an account?{" "}
          <span
            className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold transition-colors duration-200 hover:text-primary-700 dark:hover:text-primary-500 underline"
            onClick={() => navigate("/login")}
          >
            Login
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