import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';
import assets from '../assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';

const statusStyle = (status) => {
  if (status === 'Accepted') return 'bg-green-100 text-green-700';
  if (status === 'Rejected') return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
};

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  const updateResume = async () => {
    if (!resume) return toast.error('Please select a PDF file first');

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', resume);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || 'Resume updated');
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
      setIsEdit(false);
      setResume(null);
    }
  };

  useEffect(() => {
    if (user) fetchUserApplications();
  }, [user]);

  return (
    <>
      <Navbar />

      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        {/* Resume section */}
        <h2 className='text-xl font-semibold'>Your Resume</h2>

        <div className='flex gap-2 mb-6 mt-3 items-center flex-wrap'>
          {isEdit || !userData?.resume ? (
            <>
              <label className='flex items-center cursor-pointer' htmlFor='resumeUpload'>
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                  {resume ? resume.name : 'Select Resume'}
                </p>
                <input
                  id='resumeUpload'
                  onChange={(e) => setResume(e.target.files[0])}
                  accept='application/pdf'
                  type='file'
                  hidden
                />
                <img src={assets.profile_upload_icon} alt='' />
              </label>

              <button
                onClick={updateResume}
                disabled={uploading}
                className='bg-green-100 border border-green-400 rounded-lg px-4 py-2 disabled:opacity-60'
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>

              {userData?.resume && (
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setResume(null);
                  }}
                  className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <div className='flex gap-2'>
              <a
                className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'
                href={userData.resume}
                target='_blank'
                rel='noreferrer'
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Applied jobs */}
        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>

        {!user ? (
          <p className='text-gray-500'>Please login to see your applications.</p>
        ) : userApplications.length === 0 ? (
          <p className='text-gray-500'>You have not applied to any jobs yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border rounded-lg text-sm'>
              <thead>
                <tr>
                  <th className='py-3 px-4 border-b text-left'>Company</th>
                  <th className='py-3 px-4 border-b text-left'>Job Title</th>
                  <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                  <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                  <th className='py-3 px-4 border-b text-left'>Status</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((job) => (
                  <tr key={job._id}>
                    <td className='py-3 px-4 flex items-center gap-2 border-b'>
                      <img
                        className='w-8 h-8 object-contain'
                        src={job.companyId?.image}
                        alt=''
                      />
                      {job.companyId?.name}
                    </td>
                    <td className='py-2 px-4 border-b'>{job.jobId?.title}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>{job.jobId?.location}</td>
                    <td className='py-2 px-4 border-b max-sm:hidden'>
                      {moment(job.date).format('ll')}
                    </td>
                    <td className='py-2 px-4 border-b'>
                      <span className={`px-4 py-1.5 rounded ${statusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Applications;