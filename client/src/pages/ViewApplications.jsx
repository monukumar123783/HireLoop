import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import assets from '../assets/assets';
import { AppContext } from '../context/AppContext';

const statusStyle = {
  Pending: 'text-gray-500',
  Accepted: 'text-green-600',
  Rejected: 'text-red-500',
};

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all applications received by this company
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        const list = data.applications || data.applicants || [];
        setApplicants([...list].reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Accept or reject an application
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || `Application ${status.toLowerCase()}`);
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobApplications();
  }, [companyToken]);

  if (loading) return <p className='p-4 text-gray-500'>Loading...</p>;

  // Skip applications whose user or job was deleted
  const validApplicants = applicants.filter((item) => item.jobId && item.userId);

  return (
    <div className='container mx-auto p-4'>
      {validApplicants.length === 0 ? (
        <p className='text-center py-16 text-gray-500'>No applications received yet</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
            <thead>
              <tr className='border-b text-left'>
                <th className='py-2 px-4 text-center'>#</th>
                <th className='py-2 px-4'>User name</th>
                <th className='py-2 px-4 max-sm:hidden'>Job Title</th>
                <th className='py-2 px-4 max-sm:hidden'>Location</th>
                <th className='py-2 px-4'>Resume</th>
                <th className='py-2 px-4'>Action</th>
              </tr>
            </thead>

            <tbody>
              {validApplicants.map((applicant, index) => (
                <tr key={applicant._id} className='text-gray-700'>
                  <td className='py-2 px-4 border-b text-center'>{index + 1}</td>

                  <td className='py-2 px-4 border-b'>
                    <div className='flex items-center gap-2'>
                      <img
                        className='w-10 h-10 rounded-full object-cover max-sm:hidden'
                        src={applicant.userId.image}
                        alt=''
                      />
                      <span>{applicant.userId.name}</span>
                    </div>
                  </td>

                  <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.location}</td>

                  <td className='py-2 px-4 border-b'>
                    {applicant.userId.resume ? (
                      <a
                        href={applicant.userId.resume}
                        target='_blank'
                        rel='noreferrer'
                        className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'
                      >
                        Resume
                        <img src={assets.resume_download_icon} alt='' />
                      </a>
                    ) : (
                      <span className='text-gray-400'>Not uploaded</span>
                    )}
                  </td>

                  <td className='py-2 px-4 border-b'>
                    {applicant.status === 'Pending' ? (
                      <div className='flex gap-2'>
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                          className='text-green-600 border border-green-300 px-3 py-1 rounded hover:bg-green-50'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                          className='text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50'
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`font-medium ${statusStyle[applicant.status] || ''}`}>
                        {applicant.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;