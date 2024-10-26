import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming an Input component is available
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Contribute() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available courses based on department and semester
    const fetchCourses = async () => {
      if (department && semester) {
        try {
          const response = await fetch(
            `${BACKEND}/api/course/${department}/${semester}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
                credentials: "include",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setCourses(data.data);
          } else {
            setCourses([]);
            console.error("Failed to fetch courses");
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };
    fetchCourses();
  }, [department, semester]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file || !courseId || !fileType) {
      setMessage("Please enter all required fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("resource", file);
    formData.append("courseId", courseId);
    formData.append("fileType", fileType);

    try {
      const response = await fetch(`${BACKEND}/api/resource/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          credentials: "include",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => navigate("/courses"), 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error uploading resource.");
      }
    } catch (error) {
      setMessage("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <Card className="max-w-xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold">
                Contribute a Resource
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
                />
                <Input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
                />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                  <option value="" disabled>
                    Select Department
                  </option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">MME</option>
                </select>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                  <option value="" disabled>
                    Select Semester
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
                />
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
                  <option value="" disabled>
                    Select File Type
                  </option>
                  <option value="notes">Notes</option>
                  <option value="slides">Slides</option>
                  <option value="assignments">Assignments</option>
                  <option value="exams">Exam Papers</option>
                  <option value="other">Other</option>
                </select>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gray-500 text-white rounded-md">
                {loading ? "Uploading..." : "Upload Resource"}
              </Button>

              {message && (
                <div
                  className={`mt-4 flex items-center text-sm px-4 py-3 rounded-md shadow-md transition-colors duration-300 ${message.includes("successfully")
                    ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-800 dark:text-green-200"
                    : "bg-red-100 text-red-700 border border-red-300 dark:bg-red-800 dark:text-red-200"
                    }`}>
                  {message.includes("successfully") ? (
                    <AiOutlineCheckCircle className="mr-2" size={18} />
                  ) : (
                    <AiOutlineExclamationCircle className="mr-2" size={18} />
                  )}
                  <p>{message}</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
