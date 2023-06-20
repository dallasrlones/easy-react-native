import { useState, useEffect } from 'react';
import OrientationListeners from './components/OrientationListeners';
import AuthNavigation from './components/AuthNavigation';
import { AppContextProvider } from './components/State';

import HomeScreen from './screens/protected/HomeScreen';
import { PrimaryScreenHeader } from './components/ScreenHeaders';

import PrimaryNavigationScreen from './screens/protected/navigation_screens/PrimaryNavigation';
import LogoutScreen from './screens/protected/LogoutScreen';

// This is the async storage location name for your tokens
// We have to name them differnetly per app because apps share async storage
const tokenNames = {
  token: 'RENAME_ME_token',
  refreshToken: 'RENAME_ME_refreshToken'
};

// This will be stored in screen props as screen.baseUrl
// This also sets up httpUtil protected routes to use the baseUrl
const baseUrl = 'http://localhost:1337';

const styles = {
  colors: {
    dark: '#3d3d3d',
    secondary: '#1d1d1d',
    warning: '#ffff00',
    danger: '#ff0000',
    success: '#00ff00',
    info: '#0000ff'
  },
  menu: {
    item: {
      fontSize: 20,
      color: '#1d1d1d',
      fontWeight: 'bold',
    }
  }
};

let screens = [];

// EXAMPLE SCREEN
const DeleteMeProfilePage = ({ elements, appState, httpUtil }) => {
  const { DIV, H1, CENTER } = elements;
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    httpUtil.PAYLOAD('GET_USER').then(res => {
      if (res.success == true) {
        setUserInfo(res.user);
      }
    }).catch(err => {
      alert(JSON.stringify(err.message));
    });
  }, []);

  return (
    <CENTER type="both" style={{ height: '100%' }}>
      <H1>Profile Page</H1>
      <DIV>{appState.currentTask}</DIV>
      <DIV>{JSON.stringify(userInfo)}</DIV>
    </CENTER>
  )
};

try {
  screens = [
    // Main Screen: Your first screen will default to the main screen!
    { name: 'Home', title: 'Home', component: HomeScreen, headerComponent: PrimaryScreenHeader },
    { name: 'Logout', title: 'Logout', component: LogoutScreen },

    // screens
    // EXAMPLE SCREEN
    { name: 'Profile', title: 'Your Profile', component: DeleteMeProfilePage, headerComponent: PrimaryScreenHeader },

    // navigation
    { name: 'PrimaryNavigation', component: PrimaryNavigationScreen },


  ];
} catch (err) {
  alert('Error loading screesn list ' + err.message);
}

export default function App() {
  // YOUR state, it will be stored in screen's prop appState
  // Example Screen: props = { appState } then appState.currentTask or appState.setCurrentTask
  const [currentTask, setCurrentTask] = useState('I like toitles');
  const customStateHooks = {
    currentTask, setCurrentTask
  };

  return (
    <AppContextProvider baseUrl={baseUrl} tokenNames={tokenNames} customStateHooks={customStateHooks} >
      <OrientationListeners />
      <AuthNavigation tokenNames={tokenNames} screens={screens} styles={styles} baseUrl={baseUrl} />
    </AppContextProvider>
  );
}
