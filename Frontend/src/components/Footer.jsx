import React from "react";
import instagramIcon from "../assets/footer/instagram.png";
import linkedinIcon from "../assets/footer/linkedin.png";
import facebookIcon from "../assets/footer/facebook.png";
import twitterIcon from "../assets/footer/twitter.png";

const Footer = () => {
  return (
    <footer className="bg-white border border-gray-200 ">
      <div className="w-full px-28 py-10">
        
       
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-600 cursor-pointer">
              <li>Graphics & Design</li>
              <li>Digital Marketing</li>
              <li>Writing & Translation</li>
              <li>Video & Animation</li>
              <li>Programming & Tech</li>
              <li>Photography</li>
              <li>AI Services</li>
              <li>Photographer</li>
              <li>Finance</li>
              <li>Bussiness</li>
              <li>End-to-End Projects</li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-gray-600 cursor-pointer">
              <li>How It Works</li>
              <li>Customer Success Stories</li>
              <li>Trust & Safety</li>
              <li>GigConnect Guides</li>
              <li>Browse Freelancer By Skills</li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-gray-600 cursor-pointer">
              <li>Become a GigConnect Freelancer</li>
              <li>Find Your Work</li>
              <li>Get Hired</li>
              <li>Forum</li>
              <li>Events</li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4">Business Solutions</h3>
            <ul className="space-y-2 text-gray-600 cursor-pointer">
              <li>GigConnect Pro</li>
              <li>Project Management</li>
              <li>Expert Sourcing</li>
              <li>Logo Maker</li>
              <li>Contact Sales</li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600 cursor-pointer">
              <li>About GigConnect</li>
              <li>Help & Support</li>
              <li>Careers</li>
              <li>Social Impact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

        </div>

        
        <div className="border-t border-gray-300 my-5"></div>

        
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

      </div>
    </footer>
  );
};

export default Footer;
