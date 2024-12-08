import React, { useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/button";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
const BACKEND = import.meta.env.VITE_BACKEND_URL;
const semesterListReturn = () => {
  let arr = [
    <option key={0} value={"NA"}>
      N/A
    </option>,
  ];
  for (let i = 1; i <= 8; i++) {
    arr.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return arr;
};

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

function CourseForm({
  formType,
  editingCourseId,
  setEditingCourseId,
  existingCourse,
}) {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    credits: "",
    isElective: false,
    offeredTo: [
      { department: "CSE", semester: "N/A" },
      { department: "CCE", semester: "N/A" },
      { department: "ECE", semester: "N/A" },
      { department: "MME", semester: "N/A" },
    ],
  });
  useEffect(() => {
    if (formType === "edit") {
      //order the existingCourse offeredTo array according to the departments: CSE, CCE , ECE, MME. Add N/A if the department is not present in the existingCourse offeredTo array
      let orderedOfferedTo = [
        { department: "CSE", semester: "N/A" },
        { department: "CCE", semester: "N/A" },
        { department: "ECE", semester: "N/A" },
        { department: "MME", semester: "N/A" },
      ];
      existingCourse.offeredTo.forEach((dept) => {
        let index = orderedOfferedTo.findIndex(
          (d) => d.department === dept.department
        );
        if (index !== -1) {
          orderedOfferedTo[index].semester = dept.semester;
        }
      });
      existingCourse.offeredTo = orderedOfferedTo;
      setCourseData(existingCourse);
    }
  }, []);
  console.log("courseData", courseData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };
  const handleSemesterChange = (semNo, index, department) => {
    {
      let updatedOfferedTo = [...courseData.offeredTo];
      updatedOfferedTo[index] = { department: department, semester: semNo };
      setCourseData({ ...courseData, offeredTo: updatedOfferedTo });
    }
  };

  const handleAddCourse = async () => {
    toast.loading("Adding course...");
    try {
      const response = await fetch(`${BACKEND}/api/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        // const addedCourse = await response.json();
        // setCourses([...courses, addedCourse]);
        setCourseData({
          name: "",
          description: "",
          credits: "",
          isElective: false,
          offeredTo: [
            { department: "CSE", semester: "N/A" },
            { department: "CCE", semester: "N/A" },
            { department: "ECE", semester: "N/A" },
            { department: "MME", semester: "N/A" },
          ],
        });
        toast.dismiss();
        toast.success("Course added successfully", {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#4caf50",
          },
        });
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
          body: JSON.stringify(courseData),
        }
      );
      if (response.ok) {
        toast.dismiss();
        toast.success("Update Successful");
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
    setCourseData({});
  };
  console.log("courseData", courseData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Name
          </label>
          <Input
            type="text"
            name="name"
            placeholder="Enter course name"
            value={courseData?.name}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Semester
          </label>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-2">
            <div className="flex  items-center px-2">
              <p className=" w-[30%]">CSE</p>
              <CustomSelect
                name="semester"
                value={courseData.offeredTo[0]?.semester}
                onChange={(e) => handleSemesterChange(e.target.value, 0, "CSE")}
                className="w-[70%]"
                required
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {semesterListReturn()}
              </CustomSelect>
            </div>
            <div className="flex  items-center px-2">
              <p className=" w-[30%]">CCE</p>
              <CustomSelect
                name="semester"
                value={courseData?.offeredTo[1]?.semester}
                onChange={(e) => {
                  handleSemesterChange(e.target.value, 1, "CCE");
                }}
                className="w-[70%]"
                required
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {semesterListReturn()}
              </CustomSelect>
            </div>
            <div className="flex items-center px-2">
              <p className=" w-[30%]">ECE</p>
              <CustomSelect
                name="semester"
                value={courseData?.offeredTo[2]?.semester}
                onChange={(e) => {
                  handleSemesterChange(e.target.value, 2, "ECE");
                }}
                className="w-[70%]"
                required
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {semesterListReturn()}
              </CustomSelect>
            </div>
            <div className="flex items-center px-2">
              <p className=" w-[30%]">MME</p>
              <CustomSelect
                name="semester"
                value={courseData?.offeredTo[3]?.semester}
                onChange={(e) => {
                  handleSemesterChange(e.target.value, 3, "MME");
                }}
                className="w-[70%]"
                required
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {semesterListReturn()}
              </CustomSelect>
            </div>
          </div>
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
            value={courseData?.credits}
            onChange={handleInputChange}
            className="w-full"
            required
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
            value={courseData?.description}
            onChange={handleInputChange}
            className="w-full"
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
            checked={courseData?.isElective}
            onChange={(e) =>
              setCourseData({
                ...courseData,
                isElective: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 dark:text-blue-500 ml-2"
          />
        </div>
      </div>
      {formType === "add" ? (
        <Button
          onClick={handleAddCourse}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FaPlus className="mr-2" /> Add Course
        </Button>
      ) : (
        <>
          <Button
            onClick={handleSaveCourse}
            className="bg-green-600 hover:bg-green-700 text-white mr-2"
          >
            <FaSave className="mr-2" /> Save
          </Button>
          <Button
            onClick={handleCancelEdit}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <FaTimes className="mr-2" /> Cancel
          </Button>
        </>
      )}
    </div>
  );
}

export default CourseForm;
