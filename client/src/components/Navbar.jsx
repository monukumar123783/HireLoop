import React ,{useContext}from "react";
import {useClerk ,UserButton, useUser} from "@clerk/clerk-react";
import { Link,useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';  
import logo from '../assets/hireloop-logo.png.png'
const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate()
  const {setShowRecruiterLogin} = useContext(AppContext)
  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap">
  <img src={logo} alt="HireLoop logo" className="h-9 w-9 object-contain" />
  <span className="text-2xl font-bold text-gray-800">
    Hire<span className="text-blue-600">Loop</span>
  </span>
   </Link>
        {user ? (
        <div className="flex items-center gap-3">
            <Link to = {'/applications'} className = "text-blue-600 font-medium">Applied Jobs</Link>
            <p></p>
            <Link to = "/interview-prep" className = "text-blue-600 font-medium">Interview Prep</Link>
        <p className="max-sm:hidden">Hi, {user.firstName + " " + user.lastName}</p>
    <UserButton />
    </div>
     ) : (
  <div className="flex gap-4 max-sm:text-xs">
    <button onClick = {() => setShowRecruiterLogin( true) }className="text-gray-600">Recruiter Login</button>
    <button
      onClick={() => openSignIn()}
      className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full">
       
      Login
      
    </button>
      
      </div>
      )}  
      </div>
    </div>
  );
};

export default Navbar;