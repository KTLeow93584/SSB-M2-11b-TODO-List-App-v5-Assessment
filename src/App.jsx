import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';

import UserAuth from './auths/UserAuth.jsx';
import GuestAuth from './auths/GuestAuth.jsx';

import NavigationPanel from './components/NavigationPanel.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import GameList from './pages/GameList';
import HertaKuru from './pages/HertaKuru';
import ErrorPage from './pages/ErrorPage';

import users from './data/users.js';
import { store } from './store.jsx';

import { ModeContextProvider } from './contexts/ModeContext.jsx';
import { ActiveUserContextProvider } from './contexts/ActiveUserContext.jsx';

import './App.css';

export function MainLayout() {
  return (
    <>
      {/* Header Panels Section */}
      <NavigationPanel foundingName={"StishFicks"} />
      <Outlet />
      {/* Footer Section */}
      <Footer foundingName={"StishFicks"} />
    </>
  );
}

function App() {
  // For pre-loading the cached List of Users Data.
  const [userList, setUserList] = useLocalStorage("users", users);

  return (
    <Container fluid className="main-container p-0">
      <ActiveUserContextProvider>
        <ModeContextProvider>
          <Provider store={store}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />

                  <Route element={
                    <UserAuth>
                      <Dashboard />
                    </UserAuth>
                  } path="/dashboard" />

                  <Route element={
                    <UserAuth>
                      <Schedule />
                    </UserAuth>
                  } path="/schedule" />

                  <Route element={
                    <GuestAuth>
                      <Login />
                    </GuestAuth>
                  } path="/login" />

                  <Route path="/register" element={<Register />} />
                  <Route path="/games" element={<GameList />} />
                  <Route path="/kururin" element={<HertaKuru />} />
                  {<Route path="*" element={<ErrorPage />} />}
                </Route>
              </Routes>
            </BrowserRouter>
          </Provider>
        </ModeContextProvider>
      </ActiveUserContextProvider>
    </Container>
  );
}

export default App;
