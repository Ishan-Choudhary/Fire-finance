import React from "react";
import HeroImage from "../assets/auth_hero_image.jpg";


const AuthHomePage: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className="min-w-screen min-h-screen flex items-center relative">
      <img src={HeroImage} alt={"Hero image"} className="hidden md:h-screen md:block md:w-1/2" />
      <div className="min-h-screen w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  )
}

export default AuthHomePage;
