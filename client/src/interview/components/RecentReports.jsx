import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllReports } from "../services/interview.api"

const RecentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllReports()
      .then((data) => setReports(data.interviewReports || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (reports.length === 0) return null;

  return (
    <section className="recent">
      <h2 className="recent__title">Your recent reports</h2>
      <div className="recent__list">
        {reports.map((r) => (
          <button
            key={r._id}
            className="recent__card"
           onClick={() => navigate(`/interview-prep/report/${r._id}`)}
          >
           <span className="recent__score">
             {r.matchScore != null ? `${r.matchScore}%` : "N/A"}
            </span>
            <span className="recent__date">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentReports;