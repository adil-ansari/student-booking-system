// LoginPage.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
    
    const { access_token } = tokenResponse;

    try {
            // Use the access token to fetch user info from Google's UserInfo endpoint
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                'Authorization': `Bearer ${access_token}`,
                },
            });
            
            const userInfo = await userInfoResponse.json();
            
            console.log(userInfo); 
            
            // Here you can check if the email is from sjsu.edu and proceed accordingly
            if (userInfo.email && userInfo.email.endsWith('@sjsu.edu')) {
                login(userInfo);
                navigate('/bookslot');
            } else {
                // Handle case where email is not from sjsu.edu
                alert('Please sign in with an @sjsu.edu email');
            }
        } catch (error) {
        console.error('Failed to fetch user info:', error);
        // Handle errors, such as showing a message to the user
        }
    },
    onError: () => {
      console.log('Login Failed');
    },
    clientId: "774141818727-2k7igjlh0q78585k8v3ebpiva6n0l3co.apps.googleusercontent.com",
  });

  return (
    <div className="centered-container">
      <div className="content-box">
        <h2>CSSL Tutor - Slot Booking</h2>
        <button className="google-signin-btn" onClick={() => handleLogin()}>
          <img src="data:image/png;base64,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"
          alt="Google sign-in" className="google-logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
  
};

export default LoginPage;
