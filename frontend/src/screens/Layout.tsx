 import { Outlet, useLocation } from 'react-router-dom';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import React, { useState, useEffect } from 'react';
 import UserModal from "../components/UserModal";
 import defaultBackground from "../assets/backgrounds/background1.svg"
 import axios from "axios";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import "../styles/GlobalReset.css"; 
 import { User } from "../types/User";
 import { jwtDecode } from "jwt-decode";
 import { useUser } from '../context/UserContext';
 import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
 import { auth } from "../../firebaseConfig"; // Import your Firebase configuration
 

    
const Layout: React.FC = () => {
    const [showUserModal, setShowUserModal] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const setShowUserModalToTrue = () => setShowUserModal(true);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const {user, setUser, tenant} = useUser(); // Access the user data from the context
    const location = useLocation();
    const path = location.pathname;

    useEffect(() => {
      const loadBackground = async () => {
        try {
          const storedTheme = tenant?._theme ?? 1;
          const background = await import(`../assets/backgrounds/background${storedTheme}.svg`);
          setBackgroundImage(background.default);
        } catch (error) {
          console.error("Error loading background:", error);
        }
      };
      loadBackground();
    }, [tenant]);

const handleToken = async (token: string) => {
  try {
    // Create a Firebase credential with the Google ID Token
    const credential = GoogleAuthProvider.credential(token);
    // Sign in to Firebase using the credential
    const result = await signInWithCredential(auth, credential);
    // Extract user information from the result
    const user = result.user;
    const fetchedUser = await axios.get(`${apiUrl}/api-gateway/getUser/${user.uid}`);
    console.log(fetchedUser)
    const userData: User = {
      _userId: user.uid || "noId",
      _username: user.displayName || "Anonymous",  // Display Name
      _email: user.email || "No email",  // Email
      _picture: user.photoURL || "No picture",  // Photo URL
      _role: fetchedUser.data.user.role || "default",  // Custom role from claims (default if not set)
      _tenantId: "", 
    };
    setUser(userData); //here we fetch the tenant and update tenantId value
    console.log("User fetched and set successfully:", userData);
  } catch (err: any) {
    toast.error("Failed to fetch user information.");
    console.error("Firebase Auth Error:", err.message);
    throw err;
  }
};

    const getHeaderText = () => {
        switch (path) {
          case '/':
            return 'Home Page';
          case '/defects':
            return 'Defects';
            case '/financial':
              return 'Financial';
            case '/tenanthome':
              return 'Tenant Home Page';
          default:
            if (path.startsWith('/parkings/')) {
              const parkingName = path.split('/parkings/')[1]; // Extract parking name
              return `Parking: ${parkingName}`;
          }
          return '404';
        }
      };
    
      const handleRegister = async (userData: User) => {
        try {
          await axios.post(`${apiUrl}/users/register`, userData);
          //setShowUserRegisterModal(false)
          toast.success(`Register successful. Welcome, ${userData._username}!`, {
            position: "top-right",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setUser(userData)
        } catch (err: any) {
          console.log(err.response.data);
          //setShowUserRegisterModal(false)
          toast.error("Failed to register, please try again. Make sure the username doesn't already exist.", {
            position: "top-right",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    
      const handleLogout = async () => {
        try {
          /*await axios.post(`${apiUrl}/users/logout`);*/
          setShowUserModal(false)
          toast.success(`Log out  successful. Bye!`, {
            position: "top-right",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setUser(null)
          //localStorage.removeItem('google_token');
        } catch (err: any) {
          console.log(err.response.data);
          setShowUserModal(false)
          toast.error("Failed to log out.", {
            position: "top-right",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }

      
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: backgroundImage? `url(${backgroundImage})`  : `url(${defaultBackground})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
        {showUserModal && (
            <UserModal
              user={user}
              onClose={() => setShowUserModal(false)}
              onLogout={(handleLogout)}
              onTokenReceived={(handleToken)}
            />
          )}
          {/* Shared Header */}
          <Header setFunct={setShowUserModalToTrue} headerText={getHeaderText()} theme={tenant?._theme || 1}/>
    
          {/* Main Content */}
          <main style={{fontFamily:'Arial', minHeight: "100vh", color: !tenant || tenant._theme < 5? 'black': 'white'}}>
            <Outlet />
          </main>
    
          {/* Shared Footer */}
          <Footer theme={tenant?._theme || 1}/>

          <ToastContainer 
            position="top-right" 
            autoClose={5000} // Adjust auto close duration
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      );
    };



// const Layout: React.FC = () => {
//   return (
//     <>
//       {/* Shared Header */}
//       <Header setFunct={() => null }/>

//       {/* Main Content */}
//       <main>
//         <Outlet />
//       </main>

//       {/* Shared Footer */}
//       <Footer />
//     </>
//   );
// };

export default Layout;

