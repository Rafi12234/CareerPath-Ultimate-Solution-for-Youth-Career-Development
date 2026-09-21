import { Navigate, useParams } from 'react-router-dom';

// Dedicated route kept for convenient links from a job card.
// The canonical applicant browser owns filtering, search and status state.
export default function CompanyJobApplications() {
  const { jobId } = useParams();
  return <Navigate to={`/company/applications?job_id=${encodeURIComponent(jobId || '')}`} replace />;
}
