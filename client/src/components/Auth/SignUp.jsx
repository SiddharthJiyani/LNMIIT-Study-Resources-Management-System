import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/Input";
import { cn } from "@/lib/utils";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const BACKEND = import.meta.env.VITE_BACKEND_URL;


export function SignupFormDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "student",
    department: "CSE",
    semester: "1",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending OTP...");

    localStorage.setItem("signupData", JSON.stringify(formData));

    try {
      const response = await fetch(`${BACKEND}/api/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.dismiss();
        toast.success("OTP sent to your email");
        navigate("/verifyotp");
      } else {
        toast.dismiss();
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error sending OTP");
    }
  };

  return (
    <div className="m-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
      <Toaster />
      <div className="flex justify-center pt-1 pb-6">
        <img width={200} height={200} src={logo} alt="logo" />
      </div>
      <div className="text-center mb-4">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to LNMIIT Study Resource Management System
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign up with your LNMIIT email
        </p>
      </div>

      <form className="my-4 space-y-4" onSubmit={handleSubmit}>
        {/* Account Type, Department & Semester */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="accountType">Account Type</Label>
            <select
              id="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="border border-gray-300 dark:border-neutral-700 rounded-md p-2 w-full"
            >
              <option value="student">Student</option>
              <option value="faculty">Admin</option>
            </select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-gray-300 dark:border-neutral-700 rounded-md p-2 w-full"
            >
              <option value="CSE">CSE</option>
              <option value="CCE">CCE</option>
              <option value="ECE">ECE</option>
              <option value="ME">MME</option>
            </select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="semester">Semester</Label>
            <select
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              className="border border-gray-300 dark:border-neutral-700 rounded-md p-2 w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </LabelInputContainer>
        </div>

        {/* Name Fields */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        {/* Email Field */}
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="2xxxxxx@lnmiit.ac.in"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </LabelInputContainer>

        {/* Password Fields */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        {/* Submit Button */}
        <button
          className={`bg-gradient-to-br from-black to-neutral-600 dark:from-zinc-900 dark:to-zinc-900 text-white w-full rounded-md h-10 font-medium transition-opacity duration-200 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-neutral-600 dark:text-neutral-300 text-sm">
          Already have an account?{" "}
          <span
            className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold underline"
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
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
