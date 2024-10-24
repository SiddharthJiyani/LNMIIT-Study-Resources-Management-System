import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Label } from "./ui/label";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleOtpSubmit = async (e) => {
  //   e.preventDefault();
  //   toast.loading("Verifying OTP...");
  //   setLoading(true);

  //   // Here you will make the OTP verification request.
  //   try {
  //     const response = await fetch(
  //       "http://localhost:4000/api/auth/sendotp",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ otp }),
  //         credentials: "include",
  //       }
  //     );

  //     const data = await response.json();
  //     if (response.ok && data.success) {
  //       toast.dismiss();
  //       toast.success("OTP verified successfully");
  //       navigate("/success-page");
  //     } else {
  //       toast.dismiss();
  //       toast.error(data.message || "Invalid OTP. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.dismiss();
  //     toast.error("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    toast.loading('Verifying OTP and completing signup...');
    setLoading(true);
  
    // Retrieve the signup data from localStorage
    const signupData = JSON.parse(localStorage.getItem('signupData'));
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...signupData, otp }), // Send all signup data along with OTP for verification
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        toast.dismiss();
        localStorage.removeItem('signupData');
        toast.success('Signup successful');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.dismiss();
        toast.error(data.message || 'Invalid OTP or Signup failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Error during signup process');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="m-10  max-w-md w-full h-sc mx-14 lg:mx-auto rounded-2xl p-4 md:p-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white dark:bg-black">
        <Toaster />
        <div className="flex justify-center pt-1 pb-6">
          <img width={250} height={250} src={logo} alt="logo" />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
            Check your mail
          </h2>
          <p className="text-neutral-600 text-md max-w-sm mt-2 dark:text-neutral-300 p-2">
            We've sent you a 6-digit verification code to your email. Please
            enter it below to proceed.
          </p>
        </div>

        <form className="my-8" onSubmit={handleOtpSubmit}>
          <Label htmlFor="otp">Enter OTP</Label>
          <div className="flex justify-center items-center mt-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              shouldAutoFocus
              containerStyle={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.5rem",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#FFFFFF",
                    color: "#111827",
                    fontSize: "16px",
                    textAlign: "center",
                    transition: "border 0.3s ease",
                    outline: "none",
                  }}
                  className="focus:border-black focus:ring-2 focus:ring-black"
                />
              )}
            />
          </div>

          <button
            className={`bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
              loading && "opacity-50 cursor-not-allowed"
            } mt-8`}
            type="submit"
            disabled={loading}>
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>

        {/* <div className="text-center mt-4">
          <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-base">
            Didn't receive the code?{" "}
            <span
              className="text-primary-600 dark:text-primary-400 cursor-pointer font-semibold transition-colors duration-200 hover:text-primary-700 dark:hover:text-primary-500 underline"
              onClick={() => toast("Resending OTP...")}>
              Resend OTP
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
};
