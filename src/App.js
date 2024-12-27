import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { AuthContextProvider } from './context/context'


// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const updateTheme = () => {
   let value = localStorage.getItem("coreui-free-react-admin-template-theme");
    if (value === "light") {
      setIsDarkMode(false);
    } else if (value === "dark") {
      setIsDarkMode(true);
    } else {
      // Se o tema estiver definido como "auto" ou não definido, use a preferência do sistema
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkScheme);
    }
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];

    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleColorSchemeChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleColorSchemeChange);

    // Atualiza o tema inicial
    updateTheme();

    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTheme();
    }, 1000); // Verifica o tema a cada 1 segundo

    return () => clearInterval(intervalId);
  }, []);
  return (
    <HashRouter>
      
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >


        <AuthContextProvider>

        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
        </AuthContextProvider>
       
        <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} theme={isDarkMode ? 'dark' : 'light'} />
      </Suspense>
      
    </HashRouter>
  )
}

export default App
