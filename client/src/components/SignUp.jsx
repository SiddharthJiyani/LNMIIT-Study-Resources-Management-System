import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/Input";
import { cn } from "../utils/cn";
import logo from "../assets/logo.png";

export function SignupFormDemo() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
  
    const signupData = {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      accountType: "student", 
      // otp: otpValue,
    };
    
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
  
      if (response.ok && data.success) {
        console.log("Signup successful", data);
        window.location.href = "/login"; //*****CHANGE THIS TO OTP ROUTE after testing phase********
      } else {
        console.error("Signup error", data.message);
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error", error);
      setError("An unexpected error occurred. Please try again.");
    } finally{
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="flex justify-center pt-10 pb-10">
        <img src={logo} alt="logo" />
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
          Welcome to LNMIIT Resource Management
        </h2>
        <p className="text-neutral-600 text-md max-w-sm mt-2 dark:text-neutral-300 p-2">
          Sign up if you are a student of LNMIIT and have an LNMIIT domain email
        </p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display validation errors */}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="David"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Martinez"
              type="text"
              value={formData.lastname}
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
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${loading && 'opacity-50 cursor-not-allowed'}`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
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