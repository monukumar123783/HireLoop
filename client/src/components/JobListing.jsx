import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import assets, { JobCategories, JobLocations } from '../assets/assets';
import JobCard from './JobCard';

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredLobs,setFilteredJobs] = useState(jobs)

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };
   
  // Hero search + sidebar checkboxes, sab ek saath
  const filteredJobs = jobs.filter(job => {
    const title = (job.title || '').toLowerCase();
    const location = (job.location || '').toLowerCase();

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.some(l => l.toLowerCase() === location);

    const matchesTitle =
      !searchFilter.title || title.includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation =
      !searchFilter.location || location.includes(searchFilter.location.toLowerCase());

    return matchesCategory && matchesLocation && matchesTitle && matchesSearchLocation;
  });

  const totalPages = Math.ceil(filteredJobs.length / 6);

  // Filter badalne par page 1 par wapas jao
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedLocations, searchFilter]);

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
      {/* Sidebar */}
      <div className='w-full lg:w-1/4 bg-white px-4'>
        {/* Search filter from hero component */}
        {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
          <>
            <h3 className='font-medium text-lg mb-2'>Current search</h3>
            <div className='mb-4 text-gray-600'>
              {searchFilter.title && (
                <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter({ ...searchFilter, title: '' })}
                    className='cursor-pointer'
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter({ ...searchFilter, location: '' })}
                    className='cursor-pointer'
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
            </div>
          </>
        )}

        <button
          onClick={() => setShowFilter(prev => !prev)}
          className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'
        >
          {showFilter ? 'Close' : 'Filters'}
        </button>

        {/* Job categories */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
          <h4 className='font-medium text-gray-800 py-4'>Search by Categories</h4>
          <ul className='space-y-4 text-gray-600'>
            {JobCategories.map((category, index) => (
              <li className='flex gap-3 items-center' key={index}>
                <input
                  className='scale-125'
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Job locations */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
          <h4 className='font-medium text-gray-800 py-4 pt-14'>Search by Locations</h4>
          <ul className='space-y-4 text-gray-600'>
            {JobLocations.map((location, index) => (
              <li className='flex gap-3 items-center' key={index}>
                <input
                  className='scale-125'
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job listings */}
      <section className='w-full lg:w-3/4 text-gray-600 max-lg:px-4'>
        <h3 className='font-medium text-3xl py-2' id="job-list">Latest Jobs</h3>
        <p className='mb-8'>Get your desired job from top companies</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filteredJobs.length === 0 && (
            <p className='col-span-full text-center text-gray-500'>No jobs found</p>
          )}

          {filteredJobs
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, index) => (
              <JobCard key={job._id || job.id || index} job={job} />
            ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className='flex items-center justify-center space-x-2 mt-10'>
            <a href="#job-list">
              <img
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>

            {Array.from({ length: totalPages }).map((_, index) => (
              <a key={index} href="#job-list">
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}

            <a href="#job-list">
              <img
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;