import React, { useState, useEffect } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
export const YTLinks = ({ courseName }) => {
  const [ytLinks, setYtLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("courseName:", courseName); //debug
  useEffect(() => {
    const fetchYtLinks = async () => {
      try {
        const response = await fetch(
          `${BACKEND}/api/ytlink/getYTLinks/${courseName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch YouTube links");

        const data = await response.json();
        setYtLinks(Array.isArray(data.ytLinks) ? data.ytLinks : []);
      } catch (error) {
        console.error("Error fetching YouTube links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchYtLinks();
  }, [courseName]);

  if (loading) {
    return <p className="text-center text-lg mt-6">Loading YouTube links...</p>;
  }

  if (ytLinks.length === 0) {
    return (
      <p className="text-center mt-6 text-zinc-500">
        No YouTube links available for this course.
      </p>
    );
  }

  return (
    <section className="my-10 px-4">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {ytLinks.map((link) => (
          <div
            key={link._id}
            className="bg-gradient-to-br group from-white/70 via-white/60 to-white/40 dark:from-zinc-800/70 dark:via-zinc-800/60 dark:to-zinc-800/40 rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="relative overflow-hidden">
              <img
                src={link.thumbnail}
                alt={link.title}
                className="w-full h-[138px]  object-cover transition-transform duration-300 hover:scale-110 rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 truncate">
                {link.title}
              </h3>
              {/* <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                {new Date(link.createdAt).toLocaleDateString()}
              </p> */}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full text-sm font-medium py-2 px-4 text-white bg-black rounded-lg shadow-lg transition-transform duration-200 hover:scale-105">
                Watch Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
