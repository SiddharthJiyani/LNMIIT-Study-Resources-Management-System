import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import { Toaster, toast } from 'react-hot-toast';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const AddYT = () => {
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [courseId, setCourseId] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  useEffect(() => {
    const fetchCourses = async () => {
      if (department && semester) {
        try {
          const response = await fetch(`${BACKEND}/api/course/${department}/${semester}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (response.ok) {
            setCourses(data.data);
          } else {
            toast.error('Failed to fetch courses');
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
          toast.error('Error fetching courses');
        }
      }
    };
    fetchCourses();
  }, [department, semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("url", youtubeLink);
    formData.append("description", description);
    formData.append("courseName", courseName);

    try {
      const response = await fetch(`${BACKEND}/api/ytlink/addYTLink`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('YouTube link added successfully');
        setYoutubeLink('');
        setDescription('');
      } else {
        toast.error(data.message || 'Error adding YouTube link');
      }
    } catch (error) {
      console.error('Error submitting YouTube link:', error);
      toast.error('Error adding YouTube link');
    }
  };
  // console.log(courseId, courseName)
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Toaster />
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 p-4 bg-white shadow rounded-md">
            <h2 className="text-2xl font-semibold text-center">Add YouTube Link</h2>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
              <option value="" disabled>
                Select Department
              </option>
              <option value="CSE">CSE</option>
              <option value="CCE">CCE</option>
              <option value="ECE">ECE</option>
              <option value="MME">MME</option>
            </select>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700">
              <option value="" disabled>
                Select Semester
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>

            <select
              value={courseId}
              onChange={(e) => { setCourseId(e.target.value); setCourseName(e.target.options[e.target.selectedIndex].text) }}
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

            <input
              type="text"
              placeholder="YouTube Link"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700"
            />

            <button
              type="submit"
              className="w-full p-2 bg-black text-white font-semibold rounded-md hover:bg-zinc-900"
            >
              Add YouTube Link
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
