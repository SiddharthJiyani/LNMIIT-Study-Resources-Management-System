import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';

const MyContributions = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resource/user/${user._id}`, options);
        if (!response.ok) throw new Error("Failed to fetch resources");

        const data = await response.json();
        setResources(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user resources:", error);
        setLoading(false);
      }
    };
    fetchUserResources();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-700">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <NavBar />
      <div className="flex flex-1">
        <aside className="hidden md:block md:w-[200px] bg-background border-r">
          <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Your Uploaded Resources</h2>
            <div className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-zinc-800">
              <table className="min-w-full bg-white dark:bg-zinc-800 text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-700">
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">S. No.</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Title</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resources?.resources.length > 0 ? (
                    resources.resources.map((resource, index) => (
                      <tr key={resource._id} className="border-t hover:bg-gray-50 dark:hover:bg-zinc-700">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{index + 1}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{resource.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                              resource.isApproved
                                ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                                : "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                            }`}
                          >
                            {resource.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-gray-500 dark:text-gray-400">
                        No resources uploaded
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

export default MyContributions;
