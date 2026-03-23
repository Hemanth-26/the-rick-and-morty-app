import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="message">
      <h2>404 — Page not found</h2>
      <p style={{ marginTop: 12 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn" style={{ display: "inline-block", marginTop: 20 }}>
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
