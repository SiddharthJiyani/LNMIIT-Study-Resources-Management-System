import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Book, Star, User, Calendar, Calculator, ChartArea, HandHeart, MessageCircle } from 'lucide-react'
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AllCourses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Get the token from local storage
                const token = localStorage.getItem("token");

                // Set up the request options with headers
                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };

                const response = await fetch(`${BACKEND}/api/course/all`, options);
                if (!response.ok) throw new Error("Failed to fetch courses");

                const data = await response.json();
                setCourses(data.data); // Adjust based on your actual response structure
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    if (loading) return <div>Loading...</div>; //replace with preloader

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <NavBar />
            <div className="flex flex-1">
                <aside className="hidden h-screen border-r bg-background md:block">
                    <SideBar />
                </aside>
                <main className="flex-1 p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* <Card className="transition-transform hover:scale-105">
                            <CardHeader>
                                <CardTitle>All Courses</CardTitle>
                            </CardHeader>
                        </Card> */}
                        {courses.map((course) => (
                            <Card key={course._id} className="transition-transform hover:scale-105" onClick={() => handleCourseClick(course._id)}>
                                <CardHeader>
                                    <CardTitle>{course.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

