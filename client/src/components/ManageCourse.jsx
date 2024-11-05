import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import {
  FaTrash,
  FaPlus,
  FaSearch,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

const CustomSelect = ({ value, onChange, children, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-[#f9fafb] dark:bg-zinc-800  dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}>
      {children}
    </select>
  );
};

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    semester: "",
    credits: "",
    isElective: false,
    department: "",
  });
  const [selectedSemester, setSelectedSemester] = useState("5");
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [loading, setLoading] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    toast.loading("Adding course...");
    try {
      const response = await fetch(`${BACKEND}/api/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCourse),
      });
      if (response.ok) {
        toast.dismiss();
        const addedCourse = await response.json();
        setCourses([...courses, addedCourse]);
        setNewCourse({
          name: "",
          description: "",
          semester: "",
          credits: "",
          isElective: false,
          department: "",
        });
        toast.success("Course added successfully");
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add course");
      console.error("Error adding course:", error);
    }
  };

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
    setEditedCourse({
      ...course,
    });
  };

  const handleSaveCourse = async () => {
    toast.loading("Saving changes...");
    try {
      const response = await fetch(
        `${BACKEND}/api/course/edit/${editingCourseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editedCourse),
        }
      );
      if (response.ok) {
        toast.dismiss();
        const updatedCourse = await response.json();
        setCourses(
          courses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          )
        );
        setEditingCourseId(null);
        toast.success("Course updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update course:", response);
        throw new Error();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update course");
      console.error("Error updating course:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setEditedCourse({});
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name &&
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Toaster />
      <NavBar />
      <div className="flex">
        <SideBar />

        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
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
                <form onSubmit={handleAddCourse} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Course Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter course name"
                        value={newCourse?.name}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Department
                      </label>
                      <CustomSelect
                        name="department"
                        value={newCourse?.department}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            department: e.target.value,
                          })
                        }
                        className="w-full"
                        required>
                        <option value="" disabled>Select Department</option>
                        <option value="CSE">CSE</option>
                        <option value="CCE">CCE</option>
                        <option value="ECE">ECE</option>
                        <option value="MME">MME</option>
                      </CustomSelect>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Semester
                      </label>
                      <CustomSelect
                        name="semester"
                        value={newCourse?.semester}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            semester: e.target.value,
                          })
                        }
                        className="w-full"
                        required>
                        <option value="" disabled>Select Semester</option>
                        {[...Array(8)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {" "}
                            {i + 1}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>
                    {/* Credits */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Credits
                      </label>
                      <Input
                        type="number"
                        name="credits"
                        placeholder="Enter course credits"
                        value={newCourse?.credits}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                    </div>
                    {/* isElective? */}
                    <div className="flex items-center ml-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Is Elective?
                      </label>
                      {/* checkbox */}
                      <input
                        type="checkbox"
                        name="isElective"
                        checked={newCourse?.isElective}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            isElective: e.target.checked,
                          })
                        }
                        className="w-6 h-6 text-blue-600 dark:text-blue-500 ml-2"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Course description, faculty details..."
                        value={newCourse?.description}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <FaPlus className="mr-2" /> Add Course
                  </Button>
                </form>
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
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="">
                      <option value="CSE">CSE</option>
                      <option value="CCE">CCE</option>
                      <option value="ECE">ECE</option>
                      <option value="MME">MME</option>
                    </CustomSelect>
                    <CustomSelect
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="ml-2">
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
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                        {editingCourseId === course._id ? (
                          <div className="flex flex-col md:flex-row gap-4">
                            <Input
                              type="text"
                              value={editedCourse?.name}
                              onChange={(e) =>
                                setEditedCourse({
                                  ...editedCourse,
                                  name: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                            <Input
                              type="text"
                              value={editedCourse?.description}
                              onChange={(e) =>
                                setEditedCourse({
                                  ...editedCourse,
                                  description: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={editedCourse?.credits}
                              onChange={(e) =>
                                setEditedCourse({
                                  ...editedCourse,
                                  credits: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                            <div className="flex items-center">
                              <label className="mr-2">Is Elective?</label>
                              <input
                                type="checkbox"
                                checked={editedCourse?.isElective}
                                onChange={(e) =>
                                  setEditedCourse({
                                    ...editedCourse,
                                    isElective: e.target.checked,
                                  })
                                }
                                className="w-6 h-6 text-blue-600 dark:text-blue-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSaveCourse}
                                className="bg-green-600 hover:bg-green-700 text-white">
                                <FaSave className="mr-2" /> Save
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white">
                                <FaTimes className="mr-2" /> Cancel
                              </Button>
                            </div>
                          </div>
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
                                Is Elective: {course.isElective ? "Yes" : "No"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditCourse(course)}
                                className="bg-blue-600 hover:bg-blue-700 text-white">
                                <FaEdit className="mr-2" /> Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteCourse(course._id)}
                                className="bg-red-600 hover:bg-red-700 text-white">
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
        </main>
      </div>
    </div>
  );
};

export default ManageCourse;
