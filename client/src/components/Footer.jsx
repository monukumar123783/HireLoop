import React from 'react';
import assets from '../assets/assets';
import logo from '../assets/hireloop-logo.png.png'
const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20'>
      <div className="flex items-center gap">
    <img src={logo} alt="HireLoop logo" className="h-8 w-8 object-contain" />
     <span className="text-2xl font-bold text-gray-800">
    Hire<span className="text-blue-600">Loop</span>
  </span>
   </div>

      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>
        © 2026 HireLoop | All rights reserved.
      </p>

      <div className='flex gap-2.5'>
        <img width={38} src={assets.facebook_icon} alt="Facebook" className='cursor-pointer' />
        <img width={38} src={assets.twitter_icon} alt="Twitter" className='cursor-pointer' />
        <img width={38} src={assets.instagram_icon} alt="Instagram" className='cursor-pointer' />
      </div>
    </div>
  );
};

export default Footer;