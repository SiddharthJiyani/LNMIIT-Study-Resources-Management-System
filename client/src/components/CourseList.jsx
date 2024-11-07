import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { YTLinks } from "./YTLinks";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Spinner from "./Spinner";
import toast, { Toaster } from "react-hot-toast";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const CourseList = () => {
  const profileData = JSON.parse(localStorage.getItem("user"));
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [courseName, setCourseName] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [branches, setBranches] = useState([]);
  const [gradeSurveyData, setGradeSurveyData] = useState([]);
  const [marks, setMarks] = useState("");
  const [grade, setGrade] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        // Fetch course and resources data
        const response1 = await fetch(`${BACKEND}/api/resource/showByCourse/${courseId}`, options);
        if (!response1.ok) throw new Error("Network response was not ok");
        let data1 = await response1.json();
        let courseName = data1.name;
        setCourseName(courseName);

        const response2 = await fetch(`${BACKEND}/api/resource/showByCourseName/${courseName}`, options);
        if (!response2.ok) throw new Error("Network response was not ok");
        let data2 = await response2.json();
        setBranches(data2.branches);
        setResources(data2.resources);

        // Fetch grade survey data
        const response3 = await fetch(`${BACKEND}/api/grade-survey/${courseName}`, options);
        if (!response3.ok) throw new Error("Network response was not ok");
        let data3 = await response3.json();
        // console.log(data3);
        if (data3.success) {
          setDataExists(true);
        }
        // console.log(dataExists)
        setGradeSurveyData(data3.survey);

        setLoading(false);
        data2.resources.forEach((resource) => {
          fetchFavoriteStatus(resource._id);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);

  const fetchFavoriteStatus = async (resourceId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BACKEND}/api/resource/isFavourite/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.isFavourite) {
          setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            newFavorites.add(resourceId);
            return newFavorites;
          });
        }
      } else {
        console.error("Failed to check favorite status:", response.statusText);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleRowClick = (resourceId) => {
    navigate(`/resources/${resourceId}`);
  };

  const handleFavoriteToggle = async (resourceId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BACKEND}/api/resource/addFavourite/${resourceId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setFavorites((prevFavorites) => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.has(resourceId)
            ? newFavorites.delete(resourceId)
            : newFavorites.add(resourceId);
          return newFavorites;
        });
      } else {
        console.error("Failed to toggle favorite:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const rollNumber = profileData.email.split("@")[0];
    // Validate input
    if (!marks || isNaN(marks) || marks < 0 || marks > 100) {
      alert("Please enter valid marks between 0 and 100.");
      return;
    }
    if (!grade) {
      alert("Please select a grade.");
      return;
    }

    try {
      toast.loading("Adding your response..");
      const response = await fetch(`${BACKEND}/api/grade-survey/add-or-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber: rollNumber,
          courseName: courseName,
          marks: parseInt(marks, 10),
          grade: grade,
        }),
      });

      if (response.ok) {
        toast.dismiss();
        toast.success("Response submitted successfully.");
        window.location.reload();
        setMarks("");
        setGrade("");
        // Optionally, fetch updated survey data here to refresh the displayed results
      } else {
        toast.dismiss();
        toast.error("Failed to submit grade and marks.");
        const data = await response.json();
        console.error("Failed to submit grade and marks:", data.message);
        alert("Failed to submit grade and marks.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to submit grade and marks.");
      console.error("Error submitting grade and marks:", error);
      alert("Error submitting grade and marks.");
    }
  };

  const getYearFromRoll = (rollNumber) => rollNumber.slice(0, 2);

  const organizeSurveyData = (surveyData) => {
    if (!surveyData) return {};
    const dataByYear = {};
    surveyData.forEach(({ rollNumber, grade, marks }) => {
      const year = getYearFromRoll(rollNumber);
      if (!dataByYear[year]) dataByYear[year] = {};
      if (!dataByYear[year][grade]) dataByYear[year][grade] = { min: marks, max: marks };
      else {
        dataByYear[year][grade].min = Math.min(dataByYear[year][grade].min, marks);
        dataByYear[year][grade].max = Math.max(dataByYear[year][grade].max, marks);
      }
    });
    return dataByYear;
  };

  const surveyByYear = organizeSurveyData(gradeSurveyData);
  const userDepartment = profileData.department;
  const isUserAllowed = branches.includes(userDepartment);
  const filteredResources = resources
    .filter((resource) =>
      filterType === "all" ? true : resource.fileType === filterType
    )
    .filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  // console.log(courseName);
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 dark:bg-zinc-900">
      <Toaster />
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="flex flex-col max-w-5xl mx-auto bg-white p-4 md:px-6 rounded-lg shadow-md border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
                <p className="text-[28px] text-center mb-2 font-medium">{courseName}</p>

                {/* Filter Dropdown */}
                <div className="mb-4 flex justify-between">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white mr-4"
                  />
                  <select
                    value={filterType}
                    onChange={handleFilterChange}
                    className="p-2 border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="notes">Notes</option>
                    <option value="slides">Slides</option>
                    <option value="assignments">Assignments</option>
                    <option value="pyqs">PYQs</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-zinc-200 shadow-md rounded-lg dark:border-zinc-800">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-900">
                        <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">S. No.</th>
                        <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">Name</th>
                        <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">Rating</th>
                        <th className="py-3 px-2 sm:px-4 border-b text-center dark:border-zinc-800">Favorite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResources.length > 0 ? (
                        filteredResources.map((resource, index) => (
                          <tr key={resource._id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => handleRowClick(resource._id)}>
                            <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">{index + 1}</td>
                            <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">{resource.title}</td>
                            <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">{resource.averageRating || "N/A"}</td>
                            <td className="py-2 px-2 sm:px-4 border-b text-center dark:border-zinc-800">
                              <button onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(resource._id); }} className="text-2xl">
                                {favorites.has(resource._id) ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4">No resources found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="max-w-5xl mx-auto bg-white p-4 md:px-6 rounded-lg shadow-md border mt-10 ">
                <p className="text-[28px] text-center mb-2 font-medium">YouTube Resources</p>
                <YTLinks courseName={courseName} />

              </div>
              <div className="flex flex-col max-w-5xl mx-auto bg-white p-4 md:px-6 rounded-lg shadow-md border mt-10">

                <p className="text-[28px] text-center mb-2 font-medium">Marks V/S Grade</p>
                {/* Add Marks and Grade (conditionally displayed) */}
                {isUserAllowed && profileData.email.includes("lnmiit.ac.in") && (
                  <div className="mt-4 mx-auto">
                    <h3 className="text-md font-semibold text-center">Add Your Marks and Grade</h3>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Marks"
                        className="border p-2  rounded-md max-w-[8rem]"
                      />
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="border p-2 rounded-md mx-2 h-[40px]"
                      >
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="AB">AB</option>
                        <option value="B">B</option>
                        <option value="BC">BC</option>
                        <option value="C">C</option>
                        <option value="CD">CD</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                      <Button onClick={handleSubmit} className="btn-primary">Submit</Button>
                    </div>
                  </div>
                )}

                {/* Display Grade Survey by Year */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dataExists ? (
                    Object.keys(surveyByYear).map((year) => (
                      // console.log(surveyByYear),
                      <Card key={year} className="year-card bg-white rounded-lg shadow-md p-2 my-4">
                        <CardHeader>
                          <CardTitle className="text-center text-[18px]">
                            {`Year: 20${year}`}
                          </CardTitle>
                        </CardHeader>
                        {/* <h3 className="font-bold text-lg">{`Year: 20${year}`}</h3> */}
                        <CardContent className="text-center">
                          <ul>
                            {Object.keys(surveyByYear[year]).map((grade) => (
                              <li key={grade}>
                                <strong>{grade}:</strong> {`${surveyByYear[year][grade].min} - ${surveyByYear[year][grade].max}`}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))
                  ) : (<p className="col-span-full text-center text-zinc-500 mt-4">No data available</p>)}

                </div>
              </div>
            </>
          )}

        </main>
      </div >
    </div >
  );
};

export default CourseList;

