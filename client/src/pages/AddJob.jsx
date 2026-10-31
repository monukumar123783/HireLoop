import React, { useContext, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { JobCategories, JobLocations } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(JobLocations[0]);
  const [category, setCategory] = useState(JobCategories[0]);
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  // Quill editor ek hi baar banao
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write job description here...',
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const description = quillRef.current.root.innerHTML;

    // Empty description check (Quill empty hone par "<p><br></p>" deta hai)
    if (quillRef.current.getText().trim().length === 0) {
      return toast.error('Please write a job description');
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, salary: Number(salary), category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || 'Job added successfully');

        // Form reset
        setTitle('');
        setSalary(0);
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded';

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input
          type='text'
          placeholder='Type here'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className={`${fieldClass} max-w-lg`}
        />
      </div>

      <div className='w-full max-w-lg'>
        <p className='my-2'>Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Job Category</p>
          <select className={fieldClass} onChange={(e) => setCategory(e.target.value)} value={category}>
            {JobCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Job Location</p>
          <select className={fieldClass} onChange={(e) => setLocation(e.target.value)} value={location}>
            {JobLocations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Job Level</p>
          <select className={fieldClass} onChange={(e) => setLevel(e.target.value)} value={level}>
            <option value='Beginner level'>Beginner level</option>
            <option value='Intermediate level'>Intermediate level</option>
            <option value='Senior level'>Senior level</option>
          </select>
        </div>
      </div>

      <div>
        <p className='mb-2'>Job Salary</p>
        <input
          min={0}
          className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]'
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
          type='number'
          placeholder='10000'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-28 py-3 mt-4 bg-black text-white rounded disabled:opacity-60'
      >
        {loading ? 'Adding...' : 'ADD'}
      </button>
    </form>
  );
};

export default AddJob;