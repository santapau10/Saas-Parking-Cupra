import React, { useEffect } from 'react';

type GoogleCredentialResponse = {
  credential: string;
  select_by: string;
};

type GoogleSignInButtonProps = {
  onTokenReceived: (token: string) => void; // Pass only the token
};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onTokenReceived }) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "965038707682-g2vjg9vi1coksvvmvkekcn5cur3c9nkr.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv")!,
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  const handleCredentialResponse = (response: GoogleCredentialResponse) => {
    onTokenReceived(response.credential); // Send only the token to the parent
  };

  return <div id="googleSignInDiv"></div>;
};

export default GoogleSignInButton;
