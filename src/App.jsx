// ==============================================
import { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import Container from 'react-bootstrap/Container';

import GuestAuth from './auths/GuestAuth.jsx';
import UserAuth from './auths/UserAuth.jsx';

import Footer from './components/Footer.jsx';
import NavigationPanel from './components/NavigationPanel.jsx';
import ScheduleAlarmModal from './components/ScheduleAlarmModal.jsx';

import { ModeContextProvider } from './contexts/ModeContext.jsx';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import GameList from './pages/GameList';
import KuruKuru from './pages/KuruKuru';
import ErrorPage from './pages/ErrorPage';

import {
  registerNewScheduleEvent,
  registerModifiedScheduleEvent,
  registerScheduleTimerRemovalEvent,
  registerCachedScheduleEvent,
  registerAllScheduleRemovalEvent
} from './data/time.js';
import users from './data/users.js';

import { store, persistor } from './store.jsx';

import './App.css';
// ==============================================
export function MainLayout() {
  const [scheduleTimers, setScheduleTimers] = useState([]);

  const activeUserObj = useSelector((state) => state.activeUser);
  const user = activeUserObj.user;

  // Debug
  //console.log("User.", activeUserObj);

  const [activeAlarms, setActiveAlarms] = useState([]);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const onEndIndividualAlarm = (alarmGameID) => {
    const newActiveAlarms = [...activeAlarms];

    const alarmIndex = newActiveAlarms.findIndex((alarm) => alarm.schedule.gameID === alarmGameID);
    newActiveAlarms[alarmIndex].alarmAudio.pause();

    newActiveAlarms.splice(alarmIndex, 1);
    setActiveAlarms(newActiveAlarms);

    // Closed last alarm in the group -> Close the modal.
    if (newActiveAlarms.length <= 0)
      setAlarmModalVisible(false);
  };

  const onEndAllAlarms = () => {
    activeAlarms.forEach((alarm) => alarm.alarmAudio.pause());

    setActiveAlarms([]);
    setAlarmModalVisible(false);
  };
  // ==============================================
  const getNotifyDate = (now, schedule) => {
    // Format:
    // 02:00
    // 12:00
    const timeSplit = schedule.notifyTime.split(":");

    const scheduleTimeHours = parseInt(timeSplit[0]);
    const scheduleTimeMinutes = parseInt(timeSplit[1]);

    const notifyDate = new Date();
    notifyDate.setHours(scheduleTimeHours);
    notifyDate.setMinutes(scheduleTimeMinutes);
    notifyDate.setSeconds(0);

    if (notifyDate < now)
      notifyDate.setDate(notifyDate.getDate() + 1);

    return notifyDate;
  };
  // ==============================================
  useEffect(() => {
    if (!alarmModalVisible && activeAlarms.length > 0)
      setAlarmModalVisible(true);
  }, [alarmModalVisible, activeAlarms]);
  // ==============================================
  useEffect(() => {
    // ======================
    // Alarm Trigger Callback
    const triggerAlarm = (schedule) => {
      // Debug
      //console.log("Sound the alarm!", schedule);

      const alarmAudio = new Audio(schedule.alarmFile);
      const alarmCallback = () => {
        const now = new Date();
        const alarmMinutes = parseInt(schedule.notifyTime.split(":")[1]);

        if (now.getMinutes() !== alarmMinutes) {
          alarmAudio.removeEventListener("ended", alarmCallback);
          onEndAllAlarms();
          return;
        }

        alarmAudio.currentTime = 0;
        alarmAudio.play();
      };
      alarmAudio.addEventListener("ended", alarmCallback);
      alarmAudio.play();

      const newActiveAlarm = {
        schedule: schedule,
        alarmAudio: alarmAudio
      };
      setActiveAlarms((previousAlarms) => [...previousAlarms, newActiveAlarm]);
    };
    // ======================
    // Callback when adding a new schedule timer.
    const addNewScheduleTimerCallback = (event) => {
      setScheduleTimers((prevScheduleTimers) => {
        const schedule = event.detail;
        const now = new Date();
        const notifyDate = getNotifyDate(now, schedule);
        const durationToAlarmMS = notifyDate.getTime() - now.getTime();

        const newScheduleTimer = {
          id: `${schedule.gameID}-${schedule.regionName}`,
          timer: setTimeout(() => triggerAlarm(schedule), durationToAlarmMS),
          durationToAlarmMS: durationToAlarmMS
        };

        const newTimerList = prevScheduleTimers && prevScheduleTimers.length > 0 ? [...prevScheduleTimers, newScheduleTimer] : [newScheduleTimer];

        // Debug
        //console.log("[On Add New Schedule Timer] New Timer List.", newTimerList);

        return newTimerList;
      });
    };
    window.addEventListener(registerNewScheduleEvent, addNewScheduleTimerCallback);
    // ======================
    // Callback when modifying an existing timer from cached schedules.
    const modifyExistingScheduleTimerCallback = (event) => {
      const schedule = event.detail;
      setScheduleTimers((prevScheduleTimers) => {
        // Debug
        //console.log("[On Modify an existing Timer] Pre Update.", prevScheduleTimers);

        const now = new Date();

        const existingTimerIndex = prevScheduleTimers.findIndex((scheduleTimer) => scheduleTimer.id === schedule.gameID);
        clearTimeout(prevScheduleTimers[existingTimerIndex].timer);

        const notifyDate = getNotifyDate(now, schedule);
        const durationToAlarmMS = notifyDate.getTime() - now.getTime();

        prevScheduleTimers[existingTimerIndex].timer = setTimeout(() => triggerAlarm(schedule), durationToAlarmMS);
        prevScheduleTimers[existingTimerIndex].durationToAlarmMS = durationToAlarmMS;

        // Debug
        //console.log("[On Modify an existing Timer] Post Update.", prevScheduleTimers);

        return prevScheduleTimers;
      });
    };
    window.addEventListener(registerModifiedScheduleEvent, modifyExistingScheduleTimerCallback);
    // ======================
    // Callback when modifying an existing timer from cached schedules.
    const removeScheduleTimerCallback = (event) => {
      const gameID = event.detail.gameID;

      setScheduleTimers((prevScheduleTimers) => {
        const existingTimerIndex = prevScheduleTimers.findIndex((scheduleTimer) => scheduleTimer.id === gameID);
        clearTimeout(prevScheduleTimers[existingTimerIndex].timer);
        prevScheduleTimers.splice(existingTimerIndex, 1);

        // Debug
        //console.log("[On Remove Timer] Updated Timers.", prevScheduleTimers);

        return prevScheduleTimers;
      });
    };
    window.addEventListener(registerScheduleTimerRemovalEvent, removeScheduleTimerCallback);
    // ======================
    // Callback when creating timers from user's cached schedules.
    const loadCachedScheduleTimersCallback = () => {
      setScheduleTimers((previousScheduleTimer) => {
        const now = new Date();

        if (user === null)
          return;

        previousScheduleTimer = [];
        user.tasks.forEach((schedule) => {
          const notifyDate = getNotifyDate(now, schedule);
          const durationToAlarmMS = notifyDate.getTime() - now.getTime();

          const newScheduleTimer = {
            id: schedule.gameID,
            timer: setTimeout(() => triggerAlarm(schedule), durationToAlarmMS),
            durationToAlarmMS: durationToAlarmMS
          };
          previousScheduleTimer.push(newScheduleTimer);
        });

        return previousScheduleTimer;
      });

      // Debug
      //console.log("[On Load Cached] Timers.", cachedScheduleTimerList);
    };
    window.addEventListener(registerCachedScheduleEvent, loadCachedScheduleTimersCallback);
    loadCachedScheduleTimersCallback();
    // ======================
    // Callback when clearing all existing timers (From Logout action).
    const clearAllScheduleTimersCallback = () => {
      setScheduleTimers((previousTimers) => {
        // Debug
        //console.log("[On Remove All Existing Timers] Previous Timers.", previousTimers);

        previousTimers.forEach((scheduleTimerObj) => clearTimeout(scheduleTimerObj.timer));
        return [];
      });
    };
    window.addEventListener(registerAllScheduleRemovalEvent, clearAllScheduleTimersCallback);
    // ======================
    return (() => {
      window.removeEventListener(registerNewScheduleEvent, addNewScheduleTimerCallback);
      window.removeEventListener(registerModifiedScheduleEvent, modifyExistingScheduleTimerCallback);
      window.removeEventListener(registerScheduleTimerRemovalEvent, removeScheduleTimerCallback);
      window.removeEventListener(registerCachedScheduleEvent, loadCachedScheduleTimersCallback);
      window.removeEventListener(registerCachedScheduleEvent, clearAllScheduleTimersCallback);
    })
  }, []);
  // ==============================================
  return (
    <>
      {/* Header Panels Section */}
      <NavigationPanel foundingName={"StishFicks"} />
      <Outlet />
      {/* Footer Section */}
      <Footer foundingName={"StishFicks"} />
      <ScheduleAlarmModal
        isVisible={alarmModalVisible}
        activeAlarms={activeAlarms}
        onEndIndividualAlarm={onEndIndividualAlarm}
        onEndAllAlarms={onEndAllAlarms} />
    </>
  );
}
// ==============================================
function App() {
  // Setup the Local Storage with preset "users" if first time (value of key "users" would not exist).
  useLocalStorage("users", users)[0];

  return (
    <Container fluid className="main-container p-0">
      <ModeContextProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
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
                  <Route path="/kururin" element={<KuruKuru />} />
                  {<Route path="*" element={<ErrorPage />} />}
                </Route>
              </Routes>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ModeContextProvider>
    </Container>
  );
}

export default App;
// ==============================================
