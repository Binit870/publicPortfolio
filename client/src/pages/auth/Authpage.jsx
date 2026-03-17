import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-page">
      {/* Decorative background circles */}
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>
      <div className="bg-circle circle-3"></div>

      <div className={`auth-wrapper ${isSignup ? "show-signup" : "show-login"}`}>

        {/* Left Panel - Branding */}
        <div className={`panel-overlay ${isSignup ? "slide-left" : "slide-right"}`}>
          <div className="overlay-content">
            {isSignup ? (
              <>
                <h1 className="overlay-title">Hello, Friend!</h1>
                <p className="overlay-text">
                  Already have an account? Login and continue your journey with us.
                </p>
                <button
                  className="overlay-btn"
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <h1 className="overlay-title">New Here?</h1>
                <p className="overlay-text">
                  Join us today! Create an account and start your amazing journey.
                </p>
                <button
                  className="overlay-btn"
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Forms */}
        <div className={`forms-wrapper ${isSignup ? "move-left" : ""}`}>
          <Login onSwitchToSignup={() => setIsSignup(true)} />
          <Signup onSwitchToLogin={() => setIsSignup(false)} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
