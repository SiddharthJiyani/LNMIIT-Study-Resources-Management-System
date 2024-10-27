import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, FileCheck2, FilePlus, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast, { Toaster } from "react-hot-toast";
import { User, Book, Star, Calculator, ChartArea, HandHeart, MessageCircle, BookCopy, FileCheck } from 'lucide-react';

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const navLinks = [
  { to: "/my-profile", label: "My Profile", icon: <User /> },
  { to: "/my-courses", label: "My Courses", icon: <Book /> },
  { to: "/all-courses", label: "All Courses", icon: <BookCopy /> },
  { to: "/favourites", label: "Favourites", icon: <Star /> },
  { to: "/calculate-cgpa", label: "Calculate CGPA", icon: <Calculator /> },
  { to: "/marks-vs-grade", label: "Marks vs Grade", icon: <ChartArea /> },
  { to: "/contribute", label: "Contribute", icon: <HandHeart /> },
  { to: "/my-contributions", label: "My Contributions", icon: <FilePlus /> },
  { to: "/approve", label: "Approve", icon: <FileCheck /> },
  { to: "/feedback", label: "Feedback", icon: <MessageCircle /> }
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  
  const user = JSON.parse(localStorage.getItem("user"));
  const accountType = user.accountType;
  const userName = user.firstName + " " + user.lastName;
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...");
      const response = await fetch(`${BACKEND}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.removeItem("token");
        toast.dismiss();
        toast.success("Logged out successfully");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end border-b bg-background px-4 md:px-6">
      <Toaster />
      <Link to="/" className="mr-6 flex items-center">
        <Book className="h-6 w-6" />
        <span className="sr-only">LMS</span>
      </Link>
      <nav className="hidden md:flex gap-4">
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/assignments" className="nav-link">Assignments</Link>
        <Link to="/gradebook" className="nav-link">Gradebook</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
      </nav>
      <div className="ml-auto flex items-center justify-end md:justify-normal gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/my-profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link onClick={handleLogout} to="/login">
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-lg md:hidden rounded-lg">
          <div className="flex flex-col items-start p-4 space-y-2">
            {navLinks.map(({ to, label, icon }) => (
              label === "Approve" && accountType !== "admin" ? null :
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 text-gray-800 transition-colors"
              >
                <span className="">{icon}</span>
                <span className="font-medium text-gray-900">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
