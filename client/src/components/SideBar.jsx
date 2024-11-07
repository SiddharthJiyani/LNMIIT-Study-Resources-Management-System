import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    User, Book, Star, Calculator, ChartArea, HandHeart, Youtube,
    MessageCircle, BookCopy, FileCheck, FilePlus, BookMarked, Users, ChevronDown, ChevronRight, Crown
} from 'lucide-react';

const SideBar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const accountType = user?.accountType;

    const [isAdminSectionOpen, setIsAdminSectionOpen] = useState(false);

    const navLinks = [
        { to: "/my-profile", label: "My Profile", icon: <User /> },
        { to: "/my-courses", label: "My Courses", icon: <Book /> },
        { to: "/all-courses", label: "All Courses", icon: <BookCopy /> },
        { to: "/favourites", label: "Favourites", icon: <Star /> },
        { to: "/calculate-cgpa", label: "Calculate CGPA", icon: <Calculator /> },
        // { to: "/marks-vs-grade", label: "Marks vs Grade", icon: <ChartArea /> },
        { to: "/contribute", label: "Contribute", icon: <HandHeart /> },
        { to: "/my-contributions", label: "My Contributions", icon: <FilePlus /> },
        { to: "/feedback", label: "Feedback", icon: <MessageCircle /> },
        { to: "/about-developers", label: "Our Team", icon: <Users /> }
    ];

    const adminNavLinks = [
        { to: "/approve", label: "Approve", icon: <FileCheck /> },
        { to: "/manage-course", label: "Manage Course", icon: <BookMarked /> },
        { to: "/add-yt", label: "Manage YouTube", icon: <Youtube /> }
    ];

    return (
        <aside className="hidden h-screen border-r bg-background md:block fixed overflow-y-auto pb-[64px] px-4">
            {navLinks.map(({ to, label, icon }) => (
                <Link
                    key={to}
                    to={to}
                    className={`flex h-10 items-center my-[6px] rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 ${location.pathname === to ? "bg-muted text-foreground" : ""}`}
                >
                    {icon && <span className="mr-3 h-5 w-5">{icon}</span>}
                    {label}
                </Link>
            ))}

            {accountType === 'admin' && (

                <>
                    {
                        adminNavLinks.map(({ to, label, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex h-10 items-center my-[6px] rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 ${location.pathname === to ? "bg-muted text-foreground" : ""}`}
                            >
                                {icon && <span className="mr-3 h-5 w-5">{icon}</span>}
                                {label}
                            </Link>
                        ))
                    }
                </ >
            )}
        </aside>
    );
};

export default SideBar;