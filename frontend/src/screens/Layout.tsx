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

    
const Layout: React.FC = () => {
    const [showUserModal, setShowUserModal] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const setShowUserModalToTrue = () => setShowUserModal(true);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const {user, setUser} = useUser(); // Access the user data from the context

    const location = useLocation();

    useEffect(() => {
      const loadBackground = async () => {
        try {
          const theme = user?._theme ?? 1;  // ?? is safer than ||, because it only falls back on null/undefined
          const background = await import(`../assets/backgrounds/background${theme}.svg`);
          setBackgroundImage(background.default);
        } catch (error) {
          console.error("Error loading background:", error);
        }
      };
  
      loadBackground();
    }, [user]);

    useEffect(() => {
      const token = localStorage.getItem('google_token');
      const token2 = localStorage.getItem('user');
      if (token && !token2) {
        handleToken(token)
      }
    }, []);

    interface DecodedToken {
      name: string;
      email: string;
      picture: string;
    }
    
    const handleToken = (token: string) => {
      //localStorage.setItem('google_token', token);
      const userData = jwtDecode<DecodedToken>(token); // Decode the token to get user data
      // Parse userData into a User object with the expected properties
      const user: User = {
        _username: userData.name,
        _email: userData.email,
        _picture: userData.picture,
        _theme: 5,
        _tenancyType: "enterprise"
      };
      setUser(user); // Update the user state
    };

    // once the database is actually running, the login process should be:
    // - fetch token, get username/email from it and see if it exists in database
    //    - if it does, get from the database the user that corresponds to it, = user
    //    - if not, create an initial user (kinda like the one we create in handleToken), = user
    // - setUser(user), this function (implemented in the context) will also include the create/update instruction

    const getHeaderText = () => {
        switch (location.pathname) {
          case '/':
            return 'Home Page';
          case '/defects':
            return 'Defects';
            case '/financial':
              return 'Financial';
            case '/tenanthome':
              return 'Tenant Home Page';
          default:
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
          localStorage.removeItem('google_token');
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
          <Header setFunct={setShowUserModalToTrue} headerText={getHeaderText()} theme={user?._theme || 1}/>
    
          {/* Main Content */}
          <main style={{fontFamily:'Arial', minHeight: "100vh", color: !user || user._theme < 5? 'black': 'white'}}>
            <Outlet />
          </main>
    
          {/* Shared Footer */}
          <Footer theme={user?._theme || 1}/>

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

