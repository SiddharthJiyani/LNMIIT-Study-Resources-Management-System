import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import CourseForm from "./CourseForm.jsx";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const CustomSelect = ({ value, onChange, children, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-[#f9fafb] dark:bg-zinc-800  dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  );
};

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("5");
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [loading, setLoading] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${BACKEND}/api/course/${selectedDepartment}/${selectedSemester}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            credentials: "include",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester, selectedDepartment]);

  const handleDeleteCourse = async (courseId) => {
    toast.loading("Deleting course...");
    try {
      const response = await fetch(`${BACKEND}/api/course/delete/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.dismiss();
        setCourses(courses.filter((course) => course?._id !== courseId));
        toast.success("Course deleted successfully");
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course._id);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name &&
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Toaster />
      <NavBar />
      <div className="flex">
        <SideBar />

        <main className="flex-1 p-4 md:p-6 md:ml-[217px]">
          {loading ? (
            <Spinner />
          ) : (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Course Management
                </h2>
              </div>

              {/* Add Course Form */}
              <Card className="bg-white dark:bg-zinc-800 border-2 border-blue-100 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add New Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseForm formType="add" />
                </CardContent>
              </Card>

              {/* Course List */}
              <Card className="bg-white dark:bg-zinc-800">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      Existing Courses
                    </CardTitle>
                    <div className="flex items-center min-w-40">
                      <CustomSelect
                        value={selectedDepartment}
                        onChange={(e) => {
                          setSelectedDepartment(e.target.value);
                          setEditingCourseId(null);
                        }}
                        className=""
                      >
                        <option value="CSE">CSE</option>
                        <option value="CCE">CCE</option>
                        <option value="ECE">ECE</option>
                        <option value="MME">MME</option>
                      </CustomSelect>
                      <CustomSelect
                        value={selectedSemester}
                        onChange={(e) => {
                          setSelectedSemester(e.target.value);
                          setEditingCourseId(null);
                        }}
                        className="ml-2"
                      >
                        {[...Array(8)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="relative w-full md:w-96">
                      <Input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No courses found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCourses.map((course) => (
                        <div
                          key={course._id}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                          {editingCourseId === course._id ? (
                            <CourseForm
                              formType="edit"
                              existingCourse={course}
                              editingCourseId={editingCourseId}
                              setEditingCourseId={setEditingCourseId}
                            />
                          ) : (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {course.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {course.description}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Credits: {course.credits}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Is Elective:{" "}
                                  {course.isElective ? "Yes" : "No"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleEditCourse(course)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <FaEdit className="mr-2" /> Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteCourse(course._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <FaTrash className="mr-2" /> Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageCourse;
