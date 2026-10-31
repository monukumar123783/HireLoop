import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, companyToken, setCompanyToken } =
    useContext(AppContext);

  const logout = () => {
    setCompanyToken(null);
    setCompanyData(null);
    localStorage.removeItem('companyToken');
    navigate('/');
  };

  // Login nahi hai to home par bhejo, login hai to default page kholo
  useEffect(() => {
    if (!companyToken) {
      navigate('/');
    } else if (window.location.pathname === '/dashboard') {
      navigate('/dashboard/manage-jobs');
    }
  }, [companyToken]);

  const linkClass = ({ isActive }) =>
    `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
      isActive ? 'bg-blue-100 border-r-4 border-blue-500' : ''
    }`;

  return (
    <div className='min-h-screen'>
      {/* Navbar */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <div onClick={() => navigate('/')} className='cursor-pointer'>
    <span className='text-2xl font-semibold text-neutral-800'>
    Hire<span className='text-blue-600'>Loop</span>
     </span>
     </div>

          {companyData && (
            <div className='flex items-center gap-3'>
              <p className='max-sm:hidden'>Welcome, {companyData.name}</p>
              <div className='relative group'>
                <img
                  className='w-8 h-8 rounded-full object-cover border'
                  src={companyData.image}
                  alt=''
                />
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                    <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-start'>
        {/* Sidebar */}
        <div className='inline-block min-h-screen border-r-2'>
          <ul className='flex flex-col items-start pt-5 text-gray-800'>
            <NavLink className={linkClass} to='/dashboard/add-job'>
              <img className='min-w-4' src={assets.add_icon} alt='' />
              <p className='max-sm:hidden'>Add Job</p>
            </NavLink>

            <NavLink className={linkClass} to='/dashboard/manage-jobs'>
              <img className='min-w-4' src={assets.home_icon} alt='' />
              <p className='max-sm:hidden'>Manage Jobs</p>
            </NavLink>

            <NavLink className={linkClass} to='/dashboard/view-applications'>
              <img className='min-w-4' src={assets.person_tick_icon} alt='' />
              <p className='max-sm:hidden'>View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Child pages yahan khulenge */}
        <div className='flex-1 h-full p-2 sm:p-5'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;