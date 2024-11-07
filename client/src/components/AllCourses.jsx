import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Spinner from "./Spinner";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const navigate = useNavigate();

  const departments = ["CSE", "CCE", "ECE", "MME"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchCourses = async () => {
    if (!selectedDept || !selectedSemester) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${BACKEND}/api/course/${selectedDept}/${selectedSemester}`,
        options
      );
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedDept, selectedSemester]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="space-y-2 md:space-y-0 md:space-x-4">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    variant={selectedDept === dept ? "solid" : "outline"}
                    className="w-full md:w-auto"
                  >
                    {dept}
                  </Button>
                ))}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2 md:mt-0 w-full md:w-auto">
                    {selectedSemester
                      ? `Semester ${selectedSemester}`
                      : "Select Semester"}
                    <ChevronDown className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {semesters.map((sem) => (
                    <DropdownMenuItem
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                    >
                      Semester {sem}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {(!selectedDept || !selectedSemester) && (
              <div className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                Please select a branch and a semester to explore courses.
              </div>
            )}

            {loading ? (
              <Spinner/>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full lg:px-5 sm:px-5">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Card
                      key={course._id}
                      className="transition-transform hover:scale-105 cursor-pointer "
                      onClick={() => handleCourseClick(course._id)}
                    >
                      <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-600 dark:text-gray-300">
                        {course.description}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                    No courses available for this selection.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
