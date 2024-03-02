import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';

import UserAuth from './auths/UserAuth.jsx';
import GuestAuth from './auths/GuestAuth.jsx';

import NavigationPanel from './components/NavigationPanel.jsx';
import Footer from './components/Footer.jsx';

import Dashboard from './pages/Dashboard.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import GameList from './pages/GameList.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import { store } from './store.jsx';

import users from './data/users.js';
import { ModeContextProvider } from './contexts/ModeContext.jsx';

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
  const userCache = useLocalStorage("users", users);

  return (
    <Container fluid className="main-container p-0">
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
                  <GuestAuth>
                    <Login />
                  </GuestAuth>
                } path="/login" />

                <Route path="/register" element={<Register />} />
                <Route path="/games" element={<GameList />} />
                {<Route path="*" element={<ErrorPage />} />}
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </ModeContextProvider>
    </Container>
  );
}

export default App
