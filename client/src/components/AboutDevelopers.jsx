import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const developers = [
  {
    name: "Siddharth Jiyani",
    role: "Captain Underpants",
    bio: "tbd",
    image:
      "https://res.cloudinary.com/djodcayme/image/upload/c_crop,ar_1:1/v1732422716/Siddharth/profile_cm4jlg.jpg",
    linkedin: "https://www.linkedin.com/in/siddharth-jiyani-7584a1266/",
    github: "https://github.com/SiddharthJiyani",
  },
  {
    name: "Rahul Harpal",
    role: "Spongebob Squarepants",
    bio: "tbd",
    image:
      "https://res.cloudinary.com/dedcazsvk/image/upload/v1733603760/resources/ftbqvwlfzt6bvedvlvup.jpg",
    linkedin: "https://www.linkedin.com/in/rahulharpal/",
    github: "https://github.com/rahulharpal1603",
  },
  {
    name: "Srijan Das",
    role: "Batman",
    bio: "He only comes in darkness",
    image:
      "https://res.cloudinary.com/dedcazsvk/image/upload/v1733603527/resources/njvsnzopwtjszuj7zu40.jpg",
    linkedin: "https://www.linkedin.com/in/dassrijan16/",
    github: "https://github.com/thisIsSrijan",
  },
  {
    name: "Naitik Jasani",
    role: "Superman",
    bio: "tbd",
    image:
      "https://res.cloudinary.com/dedcazsvk/image/upload/v1733603830/resources/wqt9j2nz2eb4oafbibxt.jpg",
    linkedin:
      "https://www.linkedin.com/in/naitikjasani/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/flicktoss",
  },
  {
    name: "Akshat Modi",
    role: "Ironman",
    bio: "tbd",
    image:
      "https://res.cloudinary.com/dedcazsvk/image/upload/v1733603883/resources/a8huywvsi4cuy5bc3oau.jpg",
    linkedin:
      "https://www.linkedin.com/in/akshat-modi-3048b9270/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/AUSM1526",
  },
];

const AboutDevelopers = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 md:ml-[217px]">
          <div className="min-h-screen bg-gray-100 py-10 px-4">
            {/* Title with Rocket Icon */}
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex justify-center items-center gap-2">
              <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
              Behind The Code
            </h2>
            {/* Developer Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.map((developer, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                    src={developer.image}
                    alt={`${developer.name}'s profile`}
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {developer.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{developer.role}</p>
                  {/* <p className="text-gray-700 mt-4">{developer.bio}</p> */}
                  {/* Social Media Links */}
                  <div className="flex justify-center mt-4 space-x-4">
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900"
                    >
                      <FontAwesomeIcon icon={faGithub} size="lg" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutDevelopers;
