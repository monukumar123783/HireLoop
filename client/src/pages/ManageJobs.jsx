import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ManageJobs = () => {
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs posted by this company
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        const list = data.jobsData || data.jobs || [];
        setJobs([...list].reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show or hide a job on the public job list
  const toggleVisible = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || 'Visibility updated');
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  if (loading) return <p className='p-4 text-gray-500'>Loading...</p>;

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='py-2 px-4 border-b max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b'>Job Title</th>
              <th className='py-2 px-4 border-b max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b'>Visible</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className='py-6 text-center text-gray-500'>
                  No jobs added yet
                </td>
              </tr>
            )}

            {jobs.map((job, index) => (
              <tr key={job._id} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                <td className='py-2 px-4 border-b'>{job.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>
                  {moment(job.date).format('ll')}
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                <td className='py-2 px-4 border-b text-center'>{job.applicants ?? 0}</td>
                <td className='py-2 px-4 border-b'>
                  <input
                    className='scale-125 ml-4 cursor-pointer'
                    type='checkbox'
                    checked={!!job.visible}
                    onChange={() => toggleVisible(job._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className='bg-black text-white py-2 px-4 rounded'
        >
          Add new job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;