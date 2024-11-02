import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Book, Star, Calculator, ChartArea, HandHeart, MessageCircle, BookCopy, FileCheck, FileCheck2, FilePlus, BookMarked, Users } from 'lucide-react';

const SideBar = () => {
    const location = useLocation(); // Get the current route
    const user = JSON.parse(localStorage.getItem("user"));
    const accountType = user.accountType;

    // Define the navigation links
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
        { to: "/manage-course", label: "Manage Course", icon: <BookMarked /> },
        { to: "/feedback", label: "Feedback", icon: <MessageCircle /> },
        { to: "/about-developers", label: "Our Team", icon: <Users /> }
      ];

    return (
        <aside className="hidden h-screen border-r bg-background md:block fixed">
            <nav className="flex flex-col gap-2 p-4">
                {navLinks.map(({ to, label, icon }) => (
                    (label === 'Approve' || label  === 'Manage Course') && accountType != 'admin' ? null :
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
        </aside>
    );
};

export default SideBar;
