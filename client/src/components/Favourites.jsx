import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const getProfileDetails = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/profile/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.user.favorites);
      } else {
        console.error(
          "Failed to fetch favourites:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  console.log('favorites', favorites);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1">
          <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-transform hover:scale-100 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Favorite Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {favorites?.length > 0 ? (
                    favorites.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">
                            {material.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {material.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/resources/${material._id}`)}>
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No favorite materials yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}


// UNCOMMENT BELOW CODE TO SEE HOW UI LOOKS 


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import NavBar from "./NavBar";
// import SideBar from "./SideBar";

// // const BACKEND = import.meta.env.VITE_BACKEND_URL;

// export default function Favourites() {
//   const navigate = useNavigate();
  
//   // Dummy data for preview purposes
//   const [favorites] = useState([
//     {
//       id: 1,
//       title: "Introduction to React",
//       description: "An overview of the fundamentals of React, covering components, state, and props.",
//     },
//     {
//       id: 2,
//       title: "Advanced CSS Techniques",
//       description: "Learn advanced CSS for creating modern, responsive web designs.",
//     },
//     {
//       id: 3,
//       title: "JavaScript Best Practices",
//       description: "A guide to writing clean, maintainable JavaScript code.",
//     },
//     {
//       id: 4,
//       title: "Building REST APIs",
//       description: "Explore how to create and manage REST APIs using Node.js and Express.",
//     },
//   ]);

//   // Commented out for now to preview with dummy data
//   // useEffect(() => {
//   //   getProfileDetails();
//   // }, []);

//   return (
//     <div className="flex min-h-screen w-full flex-col bg-background">
//       <NavBar />
//       <div className="flex flex-1">
//         <aside className="hidden h-screen border-r bg-background md:block">
//           <SideBar />
//         </aside>
//         <main className="flex-1 p-4 md:p-6">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card className="transition-transform hover:scale-100 col-span-1 md:col-span-2">
//               <CardHeader>
//                 <CardTitle>Favorite Materials</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   {favorites?.length > 0 ? (
//                     favorites.map((material, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center p-3 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow">
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-base">
//                             {material.title}
//                           </h4>
//                           <p className="text-sm text-muted-foreground">
//                             {material.description}
//                           </p>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           onClick={() => navigate(`/material/${material.id}`)}>
//                           View
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-muted-foreground">
//                       No favorite materials yet.
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
