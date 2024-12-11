 import { Outlet, useLocation } from 'react-router-dom';
 import Header from '../components/Header';
 import Footer from '../components/Footer';
 import React, { useState } from 'react';
 import background from "../assets/background.svg";
 import UserModal from "../components/UserModal";
 import UserRegisterModal from "../components/UserRegisterModal";
 import axios from "axios";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import "../styles/GlobalReset.css"; 
 import { User } from "../types/User";
    
const Layout: React.FC = () => {
    const [showUserModal, setShowUserModal] = useState(false);

    const setShowUserModalToTrue = () => setShowUserModal(true);
    const [showUserRegisterModal, setShowUserRegisterModal] = useState(false);
    const [username, setUsername] = useState(""); // New user state
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const location = useLocation();

    const getHeaderText = () => {
        switch (location.pathname) {
          case '/':
            return 'Home Page';
          case '/defects':
            return 'Defects';
          default:
            return '404';
        }
      };

    const handleLogin = async (userData: User) => {
        try {
          await axios.post(`${apiUrl}/users/login`, userData);
          setShowUserModal(false)
          toast.success(`Log in successful. Welcome back, ${userData._username}!`, {
            position: "top-right",
            autoClose: 3000, // 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setUsername(userData._username)
        } catch (err: any) {
          console.log(err.response.data);
          setShowUserModal(false)
          toast.error("Failed to login, username or password incorrect.", {
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
    
      const handleRegister = async (userData: User) => {
        try {
          await axios.post(`${apiUrl}/users/register`, userData);
          setShowUserRegisterModal(false)
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
          setUsername(userData._username)
        } catch (err: any) {
          console.log(err.response.data);
          setShowUserRegisterModal(false)
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
          await axios.post(`${apiUrl}/users/logout`);
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
          setUsername("")
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
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
        {showUserModal && (
            <UserModal 
              username={username}
              onClose={() => setShowUserModal(false)}
              onLogin={(handleLogin)}
              onLogout={(handleLogout)}
              onRegister={() => {setShowUserModal(false), setShowUserRegisterModal(true)}}
            />
          )}
          {showUserRegisterModal && (
            <UserRegisterModal 
              username={username}
              onClose={() => setShowUserRegisterModal(false)}
              onRegister={(handleRegister)}
            />
          )}
          {/* Shared Header */}
          <Header setFunct={setShowUserModalToTrue} headerText={getHeaderText()}/>
    
          {/* Main Content */}
          <main style={{minHeight: "100vh"}}>
            <Outlet />
          </main>
    
          {/* Shared Footer */}
          <Footer />
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

