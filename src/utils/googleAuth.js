/* eslint-disable jsdoc/require-returns */
/**
 * Google OAuth Integration Utilities
 * This file contains helper functions for Google OAuth authentication
 */

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'your-google-client-id';

/**
 * Initialize Google OAuth
 * This function would typically load the Google OAuth library
 */
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Check if Google OAuth script is already loaded
    if (window.google && window.google.accounts) {
      resolve(window.google.accounts.id);
      return;
    }

    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.accounts) {
        // Initialize Google OAuth
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        resolve(window.google.accounts.id);
      } else {
        reject(new Error('Failed to load Google OAuth'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google OAuth script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Handle Google OAuth response
 */
const handleGoogleResponse = (response) => {
  // This will be handled by the component that calls the Google login
  console.log('Google OAuth response:', response);
};

/**
 * Trigger Google OAuth login
 */
export const triggerGoogleLogin = async () => {
  try {
    const googleAuth = await initializeGoogleAuth();

    return new Promise((resolve, reject) => {
      // Override the callback for this specific login attempt
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject(new Error('No credential received from Google'));
          }
        },
      });

      // Trigger the Google login popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to renderButton if prompt doesn't work
          const buttonContainer = document.createElement('div');
          document.body.appendChild(buttonContainer);

          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
          });

          // Auto-click the button
          setTimeout(() => {
            const button = buttonContainer.querySelector('div[role="button"]');
            if (button) {
              button.click();
            }
            document.body.removeChild(buttonContainer);
          }, 100);
        }
      });
    });
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

/**
 * Decode Google JWT token (for development/testing purposes)
 */
export const decodeGoogleToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding Google token:', error);
    return null;
  }
};
