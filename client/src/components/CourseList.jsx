import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export const CourseList = () => {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
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
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/resource/showByCourse/${courseId}`,
          options
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setResources(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId]);

  const handleRowClick = (resourceId) => {
    navigate(`/resources/${resourceId}`);
  };

  const handleFavoriteToggle = (resourceId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      newFavorites.has(resourceId)
        ? newFavorites.delete(resourceId)
        : newFavorites.add(resourceId);
      return newFavorites;
    });
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center text-lg font-semibold mt-20">Loading...</div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 dark:bg-zinc-900">
      <NavBar />
      <div className="flex flex-1">
        <aside className="hidden h-screen border-r bg-white dark:bg-zinc-950 md:block ">
          <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
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
                        onClick={() => handleRowClick(resource._id)}>
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {index + 1}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {resource.title}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b dark:border-zinc-800">
                          {resource.ratings || "N/A"}
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b text-center dark:border-zinc-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(resource._id);
                            }}
                            aria-label="Add to favorites">
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
                      <td
                        colSpan="4"
                        className="py-4 text-center dark:text-zinc-400">
                        No resources available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
