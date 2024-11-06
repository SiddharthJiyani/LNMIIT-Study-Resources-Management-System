import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { YTLinks } from "./YTLinks";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const CourseList = () => {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [courseName, setCourseName] = useState("");
  const [filterType, setFilterType] = useState("all"); // New state for filtering
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
        const response = await fetch(
          `${BACKEND}/api/resource/showByCourse/${courseId}`,
        const response1 = await fetch(
          `${BACKEND
          }/api/resource/showByCourse/${courseId}`,
          options
        );
        if (!response1.ok) throw new Error("Network response was not ok");

        let data1 = await response1.json();
        let courseName = data1.name;
        // console.log(data);
        setCourseName(data1.name);
        const response2 = await fetch(
          `${BACKEND
          }/api/resource/showByCourseName/${courseName}`,
          options
        );
        if (!response2.ok) throw new Error("Network response was not ok");
        let data2 = await response2.json();
        data2 = data2.resources;
        setResources(data2);
        setLoading(false);

        // Check favorites for each resource after fetching
        data2.forEach((resource) => {
          fetchFavoriteStatus(resource._id);
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
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

  const filteredResources = resources
    .filter((resource) =>
      filterType === "all" ? true : resource.fileType === filterType
    )
    .filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="text-center text-lg font-semibold mt-20">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 dark:bg-zinc-900">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <div className="flex flex-col max-w-5xl mx-auto bg-white p-4 md:px-6 rounded-lg shadow-md border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <p className="text-[30px] text-center mb-2">{courseName}</p>

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
                    <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">
                      S. No.
                    </th>
                    <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">
                      Name
                    </th>
                    <th className="py-3 px-2 sm:px-4 border-b text-left dark:border-zinc-800">
                      Rating
                    </th>
                    <th className="py-3 px-2 sm:px-4 border-b text-center dark:border-zinc-800">
                      Favorite
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource, index) => (
                      <tr
                        key={resource._id}
                        className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        onClick={() => handleRowClick(resource._id)}
                      >
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {index + 1}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {resource.title}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {resource.averageRating || "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b text-center dark:border-zinc-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(resource._id);
                            }}
                            aria-label="Add to favorites"
                          >
                            {favorites.has(resource._id) ? (
                              <AiFillHeart className="text-red-500" />
                            ) : (
                              <AiOutlineHeart className="text-gray-500 dark:text-zinc-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center dark:text-zinc-400">
                        No resources available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <YTLinks courseId={courseId} />
        </main>
      </div>
    </div>
  );
};
