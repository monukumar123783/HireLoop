import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';
import assets from '../assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import { AppContext } from '../context/AppContext';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { jobs, backendUrl, userData, userApplications, fetchUserApplications } =
    useContext(AppContext);
  const { user } = useUser();

  const [jobData, setJobData] = useState(null);
  const [applying, setApplying] = useState(false);

  // Fetch a single job from the backend
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Apply for the current job
  const applyHandler = async () => {
    if (!user) {
      return toast.error('Please login to apply for this job');
    }
    if (!userData) {
      return toast.error('Loading your profile, please try again in a moment');
    }
    if (!userData.resume) {
      toast.error('Please upload your resume before applying');
      navigate('/applications');
      return;
    }

    try {
      setApplying(true);
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || 'Applied successfully');
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setApplying(false);
    }
  };

  // Job description ko AI Interview Prep page par bhejta hai
  const prepareHandler = () => {
    const text = new DOMParser()
      .parseFromString(jobData.description, 'text/html')
      .body.textContent;
    navigate('/interview-prep', {
      state: { jobDescription: `${jobData.title}\n\n${text}` },
    });
  };

  useEffect(() => {
    fetchJob();
    window.scrollTo(0, 0);
  }, [id]);

  const isAlreadyApplied =
    jobData && userApplications.some((item) => item.jobId?._id === jobData._id);

  // More jobs from the same company (excluding this job and already applied ones)
  const relatedJobs = jobData
    ? jobs
        .filter(
          (job) =>
            job._id !== jobData._id &&
            job.companyId?._id === jobData.companyId?._id &&
            !userApplications.some((app) => app.jobId?._id === job._id)
        )
        .slice(0, 4)
    : [];

  if (!jobData) return <Loading />;

  const buttonText = isAlreadyApplied
    ? 'Already Applied'
    : applying
    ? 'Applying...'
    : 'Apply Now';

  return (
    <>
      <Navbar />

      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          {/* Header */}
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border object-contain'
                src={jobData.companyId.image}
                alt={jobData.companyId.name}
              />

              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData.title}</h1>

                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt='' />
                    {jobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt='' />
                    {jobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt='' />
                    {jobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt='' />
                    CTC: {Number(jobData.salary).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button
                onClick={applyHandler}
                disabled={isAlreadyApplied || applying}
                className='bg-blue-600 p-2.5 px-10 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {buttonText}
              </button>
              <p className='mt-1 text-gray-600'>Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          {/* Description + related jobs */}
          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job Description</h2>

              <div
                className='rich-text'
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />

              <div className='flex flex-wrap gap-4 mt-10'>
                <button
                  onClick={applyHandler}
                  disabled={isAlreadyApplied || applying}
                  className='bg-blue-600 p-2.5 px-10 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {buttonText}
                </button>

                <button
                  onClick={prepareHandler}
                  className='border border-blue-600 text-blue-600 p-2.5 px-10 rounded hover:bg-blue-50'
                >
                  Prepare for this job
                </button>
              </div>
            </div>

            {/* Right side: more jobs from this company */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='font-semibold'>More jobs from {jobData.companyId.name}</h2>

              {relatedJobs.length === 0 && (
                <p className='text-sm text-gray-500'>No other jobs available right now</p>
              )}

              {relatedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ApplyJob;