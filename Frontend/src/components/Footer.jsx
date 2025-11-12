import React from "react";
import instagramIcon from "../assets/footer/instagram.png";
import linkedinIcon from "../assets/footer/linkedin.png";
import facebookIcon from "../assets/footer/facebook.png";
import twitterIcon from "../assets/footer/twitter.png";

const Footer = () => {
  return (
    <footer className="bg-white border border-gray-200 w-full px-28 py-5">
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-700">


        <p className="text-lg font-semibold">
          Gig<span className="text-green-600">Connect</span> © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0 text-xl">
          <button className="cursor-pointer w-9"><img src={instagramIcon} alt="" /></button>
          <button className="cursor-pointer w-9"><img src={linkedinIcon} alt="" /></button>
          <button className="cursor-pointer w-9"><img src={facebookIcon} alt="" /></button>
          <button className="cursor-pointer w-9"><img src={twitterIcon} alt="" /></button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
