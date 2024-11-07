import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import NavBar from './NavBar';
import SideBar from './SideBar';

const developers = [
    {
        name: 'Siddharth Jiyani',
        // role: 'Captain Underpants',
        bio: 'tbd',
        image: 'https://media.licdn.com/dms/image/v2/D4D35AQETRbaqLOl3Bg/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1721887061014?e=1731153600&v=beta&t=o1GCvZJ0abOmeZF4r_WBydwAqGwqtGbqTbWvUsaIIr8',
        linkedin: 'https://www.linkedin.com/in/siddharth-jiyani-7584a1266/',
        github: 'https://github.com/SiddharthJiyani'
    },
    {
        name: 'Rahul Harpal',
        // role: 'Frontend Developer',
        bio: 'tbd',
        image: 'https://media.licdn.com/dms/image/v2/D4D35AQHQGyYef2iYFg/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1716320503581?e=1731153600&v=beta&t=eGAyH8PFvxgUgYwTaSpFdTCiQ9-XbbSbxwQjpn_YxFY    ',
        linkedin: 'https://www.linkedin.com/in/rahulharpal/',
        github: 'https://github.com/rahulharpal1603'
    },
    {
        name: 'Srijan Das',
        // role: 'Batman',
        bio: 'He only comes in darkness',
        image: 'https://media.licdn.com/dms/image/v2/D5603AQHNc6bO45N1Rg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720363416069?e=1736380800&v=beta&t=sDPjyUc9d_-4GCr26fcFsKLIgXDDPEW4FpMNCHsFFBo',
        linkedin: 'https://www.linkedin.com/in/dassrijan16/',
        github: 'https://github.com/thisIsSrijan'
    },
    {
        name: 'Naitik Jasani',
        // role: 'Superman',
        bio: 'tbd',
        image: 'https://media.licdn.com/dms/image/v2/D4D03AQFrogHf6JoayA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719034745814?e=1735776000&v=beta&t=Z7In0fgHbMfGrlH3qZr2ZgSb0LoCiZRugc6Rh4aZUms',
        linkedin: 'https://www.linkedin.com/in/naitikjasani/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: 'https://github.com/flicktoss'
    },
    {
        name: 'Akshat Modi',
        // role: 'Ironman',
        bio: 'tbd',
        image: 'https://media.licdn.com/dms/image/v2/D4D03AQEvAH-AtBN96A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719410218706?e=1735776000&v=beta&t=HYi0htjB0dWMLwOLgBBea3eZ03l_syY7Kz7RSGxDSU8',
        linkedin: 'https://www.linkedin.com/in/akshat-modi-3048b9270/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: 'https://github.com/AUSM1526'
    },
];

const AboutDevelopers = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <NavBar />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1 p-4 md:p-6 md:ml-[187px]">
                    <div className="min-h-screen bg-gray-100 py-10 px-4">
                        {/* Title with Rocket Icon */}
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex justify-center items-center gap-2">
                            <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
                            Behind The Code
                        </h2>
                        {/* Developer Cards Grid */}
                        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {developers.map((developer, index) => (
                                <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                                    <img 
                                        className="w-24 h-24 rounded-full mx-auto mb-4" 
                                        src={developer.image} 
                                        alt={`${developer.name}'s profile`} 
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900">{developer.name}</h3>
                                    {/* <p className="text-gray-600 text-sm">{developer.role}</p> */}
                                    {/* <p className="text-gray-700 mt-4">{developer.bio}</p> */}
                                    {/* Social Media Links */}
                                    <div className="flex justify-center mt-4 space-x-4">
                                        <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                        <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-900">
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
