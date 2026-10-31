import React, { useContext, useState } from 'react';
import Select from 'react-select';
import assets, { JobLocations } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = React.useRef(null);
  const [location, setLocation] = useState(null);

  const locationOptions = JobLocations.map(loc => ({ value: loc, label: loc }));

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: location?.value || '',
    });
    setIsSearched(true);
  };

  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-pink-400 to-yellow-400 text-black py-16 text-center p-10 rounded-lg flex flex-col'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ jobs to apply</h2>
        <p className='mb-8 max-w-2xl mx-auto text-sm font-light px-5'>
          Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the first step towards your dream job!
        </p>

        {/* Search bar */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white rounded text-gray-600 max-w-xl w-full p-2 sm:pl-4 mx-auto gap-2 sm:gap-0'>

          {/* Job input */}
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <img className='h-4 sm:h-5' src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder='Search for jobs'
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 flex-1 min-w-0 border-t sm:border-t-0 sm:border-l-2 pt-2 sm:pt-0 sm:pl-4'>
            <img className='h-4 sm:h-5' src={assets.location_icon} alt="" />
            <Select
              className="w-full text-sm"
              options={locationOptions}
              value={location}
              onChange={setLocation}
              placeholder="Location"
              isClearable
              styles={{
                control: (base) => ({ ...base, minHeight: 36, height: 36, border: 'none', boxShadow: 'none', background: 'transparent' }),
                valueContainer: (base) => ({ ...base, padding: '0 6px' }),
                indicatorsContainer: (base) => ({ ...base, height: 36 }),
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={onSearch}
            className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full sm:m-1 sm:ml-2'
          >
            Search
          </button>
        </div>
      </div>

      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
        <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
          <p className='font-medium'>Trusted by</p>
          <img className='h-6' src={assets.microsoft_logo} alt="" />
          <img className='h-6' src={assets.amazon_logo} alt="" />
          <img className='h-6' src={assets.accenture_logo} alt="" />
          <img className='h-6' src={assets.samsung_logo} alt="" />
          <img className='h-6' src={assets.adobe_logo} alt="" />
          <img className='h-6' src={assets.walmart_logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Hero;