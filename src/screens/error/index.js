import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function ErrorPage() {
  const navigate = useNavigate();

  function backToHome() {
    navigate('/');
  }

  return (
    <div className="error-page">
      <div className="error-page-container">
        <h1>Oops! Something went wrong.</h1>
        <p>We're sorry, but an error occurred while processing your request.</p>
        <p>Please try again later.</p>
        <p onClick={backToHome} className="home-link">
          Home Page
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;
