import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { AiFillHeart } from "react-icons/ai";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getProfileDetails = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/profile/`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.user.favorites);
      } else {
        console.error("Failed to fetch favourites:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
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

  const filteredFavorites = favorites.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f4f4f5]">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]  ">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-[28px]">Favorite Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-zinc-200 shadow-md rounded-lg dark:border-zinc-800">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900">
                      <th className="py-3 px-4 border-b text-left dark:border-zinc-800">S. No.</th>
                      <th className="py-3 px-4 border-b text-left dark:border-zinc-800">Title</th>
                      <th className="py-3 px-4 border-b text-center dark:border-zinc-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFavorites.length > 0 ? (
                      filteredFavorites.map((material, index) => (
                        <tr key={material._id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                          <td className="py-2 px-4 border-b dark:border-zinc-800">{index + 1}</td>
                          <td className="py-2 px-4 border-b dark:border-zinc-800">{material.title}</td>
                          <td className="py-2 px-4 border-b text-center dark:border-zinc-800 flex flex-col sm:flex-row sm:justify-center">
                            <Button
                              onClick={() => navigate(`/resources/${material._id}`)}
                              className="mb-2 sm:mb-0 sm:mr-2"
                            >
                              View
                            </Button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFavoriteToggle(material._id);
                                window.location.reload();
                              }}
                              aria-label="Add to favorites"
                            >
                              <AiFillHeart className="text-red-500 text-2xl ml-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-4 text-center dark:text-zinc-400">
                          No favorite materials found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
