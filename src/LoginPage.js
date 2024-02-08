// LoginPage.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

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
    <div>
      <button onClick={() => handleLogin()}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
