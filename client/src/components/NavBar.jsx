import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Book,
  Star,
  User,
  Calendar,
  Calculator,
  ChartArea,
  HandHeart,
  MessageCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function NavBar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user.firstName + " " + user.lastName;
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  const handleLogout = async () => {
    // call logout api
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
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center border-b bg-background px-4 md:px-6">
      <Toaster />
      <Link to="/" className="mr-6 flex items-center">
        <Book className="h-6 w-6" />
        <span className="sr-only">LMS</span>
      </Link>
      <nav className="hidden gap-4 md:flex">
        <Link
          to="/courses"
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
          Courses
        </Link>
        <Link
          to="/assignments"
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
          Assignments
        </Link>
        <Link
          to="/gradebook"
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
          Gradebook
        </Link>
        <Link
          to="/profile"
          className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50">
          Profile
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
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
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            <Link onClick={handleLogout} to="/login">
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
