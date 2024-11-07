import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCheck, FaTimes, FaFileAlt } from "react-icons/fa"; // Icons for Approve, Reject, and File
import Spinner from "./Spinner";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Approve = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(
          `${BACKEND}/api/resource/showPendingResource`,
          options
        );
        if (!response.ok) throw new Error("Failed to fetch resources");

        const data = await response.json();
        setResources(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setLoading(false);
      }
    };
    fetchPendingResources();
  }, []);

  const handleApprove = async (resourceId) => {
    toast.loading("Approving resource...");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BACKEND}/api/resource/approve/${resourceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.dismiss();
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
        toast.success("Resource approved successfully");
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to approve resource");
      console.error("Error approving resource:", error);
    }
  };

  const handleReject = async (resourceId) => {
    toast.loading("Rejecting resource...");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BACKEND}/api/resource/delete/${resourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.dismiss();
        setResources(
          resources.filter((resource) => resource._id !== resourceId)
        );
        toast.success("Resource rejected successfully");
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to reject resource");
      console.error("Error rejecting resource:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Toaster />
      <NavBar />
      <div className="flex flex-1">
        <aside className="hidden md:block md:w-[200px] bg-background border-r">
          <SideBar />
        </aside>
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-zinc-900">
          {loading ? (
            <Spinner />
          ) : (
            <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Pending Resource Approvals
            </h2>
            {resources.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No resources awaiting approval
              </div>
            ) : (
              resources.map((resource, index) => (
                <div
                  key={resource._id}
                  className="p-6 mb-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md "
                >
                  <div className="flex items-center mb-4">
                    <FaFileAlt className="text-2xl text-gray-500 dark:text-gray-300" />
                    <h3 className="text-xl font-semibold ml-3 text-gray-800 dark:text-white">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Uploaded by:{" "}
                    <span className="font-medium">
                      {resource?.uploadedBy?.firstName +
                        " " +
                        resource?.uploadedBy?.lastName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Description: {resource.description || "No description available"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-zinc-700">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        File Type
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {resource.fileType || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Course
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {resource.course?.name || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Department
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {resource.course?.department || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Semester
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-300">
                        {resource.course?.semester || "None"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Review Details
                    </a>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(resource._id)}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        <FaCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(resource._id)}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        <FaTimes className="mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Approve;
