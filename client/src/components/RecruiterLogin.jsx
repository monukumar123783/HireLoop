import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AppContext } from '../context/AppContext';

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Sign Up ka pehla step: details ke baad logo upload par jao
    if (state === 'Sign Up' && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
      return;
    }

    try {
      setLoading(true);
      let data;

      if (state === 'Login') {
        const res = await axios.post(backendUrl + '/api/company/login', {
          email: email.trim(),
          password,
        });
        data = res.data;
      } else {
        if (!image) {
          setLoading(false);
          return toast.error('Company logo upload karo');
        }
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('email', email.trim());
        formData.append('password', password);
        formData.append('image', image);

        const res = await axios.post(backendUrl + '/api/company/register', formData);
        data = res.data;
      }

      if (data.success) {
        setCompanyData(data.company);
        setCompanyToken(data.token);
        localStorage.setItem('companyToken', data.token);
        setShowRecruiterLogin(false);
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Popup khulne par peeche ka scroll band
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const inputBox = 'border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5';
  const inputField = 'outline-none text-sm w-full text-gray-700';

  return (
    <div className='fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form
        onSubmit={onSubmitHandler}
        className='relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-sm mx-4'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>
          Recruiter {state}
        </h1>
        <p className='text-sm text-center mt-1'>
          Welcome back! Please {state === 'Login' ? 'sign in' : 'sign up'} to continue
        </p>

        {state === 'Sign Up' && isTextDataSubmitted ? (
          <div className='flex items-center gap-4 my-10'>
            <label htmlFor='logoUpload'>
              <img
                className='w-16 h-16 rounded-full object-cover cursor-pointer'
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=''
              />
              <input
                id='logoUpload'
                type='file'
                accept='image/*'
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <p>Upload company <br /> logo</p>
          </div>
        ) : (
          <>
            {state === 'Sign Up' && (
              <div className={inputBox}>
                <img src={assets.person_icon} alt='' />
                <input
                  className={inputField}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type='text'
                  placeholder='Company Name'
                  required
                />
              </div>
            )}

            <div className={inputBox}>
              <img src={assets.email_icon} alt='' />
              <input
                className={inputField}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='email'
                placeholder='Email id'
                required
              />
            </div>

            <div className={inputBox}>
              <img src={assets.lock_icon} alt='' />
              <input
                className={inputField}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type='password'
                placeholder='Password'
                required
              />
            </div>
          </>
        )}

        {state === 'Login' && (
          <p className='text-sm text-blue-600 mt-4 cursor-pointer'>Forgot password?</p>
        )}

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 w-full text-white py-2 rounded-full mt-5 disabled:opacity-60'
        >
          {loading
            ? 'Please wait...'
            : state === 'Login'
            ? 'Login'
            : isTextDataSubmitted
            ? 'Create account'
            : 'Next'}
        </button>

        {state === 'Login' ? (
          <p className='mt-5 text-center text-sm'>
            Don't have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>
              Sign Up
            </span>
          </p>
        ) : (
          <p className='mt-5 text-center text-sm'>
            Already have an account?{' '}
            <span
              className='text-blue-600 cursor-pointer'
              onClick={() => {
                setState('Login');
                setIsTextDataSubmitted(false);
              }}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className='absolute top-5 right-5 cursor-pointer'
          src={assets.cross_icon}
          alt='close'
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;