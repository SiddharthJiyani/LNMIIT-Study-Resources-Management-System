import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Spinner from "./Spinner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const profileData = JSON.parse(localStorage.getItem("user"));
  const userDepartment = profileData?.department;
  const userSemester = profileData?.semester;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(
          `${BACKEND}/api/course/${userDepartment}/${userSemester}`,
          options
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setCourses(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userDepartment, userSemester]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[217px]">
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="transition-transform hover:scale-105"
                  onClick={() => handleCourseClick(course._id)}
                >
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
