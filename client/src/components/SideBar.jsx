import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Book, Star, Calculator, ChartArea, HandHeart, MessageCircle, BookCopy } from 'lucide-react';

const SideBar = () => {
    const location = useLocation(); // Get the current route

    // Define the navigation links
    const navLinks = [
        { to: "/my-profile", label: "My Profile", icon: <User /> },
        { to: "/my-courses", label: "My Courses", icon: <Book /> },
        { to: "/all-courses", label: "All Courses", icon: <BookCopy /> },
        { to: "/favourites", label: "Favourites", icon: <Star /> },
        { to: "/calculate-cgpa", label: "Calculate CGPA", icon: <Calculator /> },
        { to: "/marks-vs-grade", label: "Marks vs Grade", icon: <ChartArea /> },
        { to: "/contribute", label: "Contribute", icon: <HandHeart /> },
        { to: "/feedback", label: "Feedback", icon: <MessageCircle /> },
    ];

    return (
        <nav className="flex flex-col gap-2 p-4">
            {navLinks.map(({ to, label, icon }) => (
                <Link
                    key={to}
                    to={to}
                    className={`flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 ${location.pathname === to ? "bg-muted text-foreground" : ""
                        }`}
                >
                    {icon && <span className="mr-3 h-5 w-5">{icon}</span>}
                    {label}
                </Link>
            ))}
        </nav>
    );
};

export default SideBar;
