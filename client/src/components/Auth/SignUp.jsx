import React, { useState } from "react";
import { Label } from "../ui/Label";
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
    accountType: "",
    department: "",
    semester: "",
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
    console.log('formData' , formData);
    localStorage.setItem('user', JSON.stringify(formData));

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

  const shadow =
    "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)";
  return (
    <div className="m-7 max-w-md w-full mx-auto rounded-2xl p-5 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
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
        {/* Name Fields */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              required
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
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>

        {/* Email & Semester */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="2xxxxxx@lnmiit.ac.in"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="semester">Semester</Label>
            <select
              id="semester"
              value={formData.semester}
              onChange={handleChange}
              className="rounded-md p-2 w-full bg-[#f9fafb] required:invalid:text-neutral-400 text-sm"
              style={{
                boxShadow: shadow,
              }}
              required>
              <option value="" disabled selected className="hidden">
                Choose
              </option>
              <option value="1" className="text-black">
                1
              </option>
              <option value="2" className="text-black">
                2
              </option>
              <option value="3" className="text-black">
                3
              </option>
              <option value="4" className="text-black">
                4
              </option>
              <option value="5" className="text-black">
                5
              </option>
              <option value="6" className="text-black">
                6
              </option>
              <option value="7" className="text-black">
                7
              </option>
              <option value="8" className="text-black">
                8
              </option>
              <option value="9" className="text-black">
                9
              </option>
              <option value="10" className="text-black">
                10
              </option>
            </select>
          </LabelInputContainer>
        </div>

        {/* Password Fields */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              required
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
              required
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
          disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-neutral-600 dark:text-neutral-300 text-sm">
          Already have an account?{" "}
          <span
            className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold underline"
            onClick={() => navigate("/login")}>
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
