import React, { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useLocation } from "react-router-dom";
import RecentReports from "../components/RecentReports";
import Footer from "../../components/Footer"
const MAX_JD = 3000;
const MAX_SELF = 1000;
const MAX_FILE_MB = 5;

const Home = () => {
  const fileInput = useRef(null);
 const location = useLocation();
const [jobDescription, setJobDescription] = useState(
  (location.state?.jobDescription || "").slice(0, MAX_JD)
);
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { generateReport,reports } = useInterview();
  const navigate = useNavigate();

  const pickFile = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, resume: `File must be under ${MAX_FILE_MB} MB` }));
      return;
    }
    setResume(file);
    setErrors((p) => ({ ...p, resume: "", form: "" }));
  };

  const removeFile = () => {
    setResume(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const next = {};
    if (!jobDescription.trim()) next.jobDescription = "Add the job description";
    if (!resume && !selfDescription.trim())
      next.form = "Upload a resume or write a self description";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    setLoading(true);
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resume,
    });
     if (!data?._id) throw new Error("Report not generated");
     navigate(`/interview-prep/report/${data._id}`);
  }  catch (err) {
  console.error("Generate error:", err);
  const msg = err?.response?.data?.message || "Couldn't generate the report. Try again";
  setErrors({ form: msg });
 }
};

  return (
    <main className="home">
      <header className="home__intro">
        <h1>Prepare for the interview they'll actually give</h1>
        <p>
          Share the role and your background. You'll get likely questions, skill
          gaps, and a prep plan.
        </p>
      </header>

      <form className="panel" onSubmit={handleSubmit} noValidate>
        <section className="panel__left">
          <div className="field-head">
            <label htmlFor="jobDescription">Job description</label>
            <span className="counter">
              {jobDescription.length}/{MAX_JD}
            </span>
          </div>
          <textarea
            id="jobDescription"
            name="jobDescription"
            maxLength={MAX_JD}
            placeholder="Paste the full job posting here"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setErrors((p) => ({ ...p, jobDescription: "" }));
            }}
            aria-invalid={!!errors.jobDescription}
          />
          {errors.jobDescription && (
            <p className="error">{errors.jobDescription}</p>
          )}
        </section>

        <section className="panel__right">
          <div className="field">
            <label htmlFor="resume">Resume</label>

            {!resume ? (
              <div
                className={`dropzone ${dragging ? "is-dragging" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInput.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && fileInput.current?.click()
                }
              >
                <strong>Drop your resume here</strong>
                <span>or click to browse. PDF only, up to {MAX_FILE_MB} MB</span>
              </div>
            ) : (
              <div className="file-chip">
                <span className="file-chip__name">{resume.name}</span>
                <button type="button" onClick={removeFile} aria-label="Remove resume">
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInput}
              id="resume"
              name="resume"
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => pickFile(e.target.files[0])}
            />
            {errors.resume && <p className="error">{errors.resume}</p>}
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="selfDescription">About you</label>
              <span className="counter">
                {selfDescription.length}/{MAX_SELF}
              </span>
            </div>
            <textarea
              id="selfDescription"
              name="selfDescription"
              maxLength={MAX_SELF}
              placeholder="Your experience, projects, and strengths in a few sentences"
              value={selfDescription}
              onChange={(e) => {
                setSelfDescription(e.target.value);
                setErrors((p) => ({ ...p, form: "" }));
              }}
            />
          </div>

          {errors.form && <p className="error">{errors.form}</p>}

          <button type="submit" className="generate-btn" disabled={loading}>
            {loading ? "Generating report…" : "Generate interview report"}
          </button>
        </section>
      </form>
      <RecentReports />
      {/* <Footer /> */}
      <div className = "big-white mt-10">
    <Footer/>
      </div>
      
    </main>
  );
};

export default Home;