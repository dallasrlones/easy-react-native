import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import OrientationListeners from './components/OrientationListeners';
import AuthNavigation from './components/AuthNavigation';
import { PrimaryScreenHeader } from './components/ScreenHeaders';
import { AppContextProvider, AppContext } from './components/State';

import HomeScreen from './screens/protected/HomeScreen';
import LogoutScreen from './screens/protected/LogoutScreen';

// these will be injected into each screen as a styles prop so we can have a global color scheme,
// you can add anything you want to this, even if you want to store static values of non style related things
// GLOBAL STATE is set in ./components/State.js though, try to use that as its magical
const styles = {
  colors: {
    dark: '#3d3d3d',
    secondary: '#1d1d1d',
    warning: '#ffff00',
    danger: '#ff0000',
    success: '#00ff00',
    info: '#0000ff'
  }
};

// The default unprotected screens are Login, Register, and ForgotPassword
// Each of which makes a POST to the /login, /register, and /forgotPassword routes respectively
// You can change those routes in the ./screens/unprotected/*.js files

// This is where you set the PROTECTED screens (once the user has logged in)
const screens = [
  { name: 'Home', component: HomeScreen, headerComponent: PrimaryScreenHeader },
  { name: 'Logout', component: LogoutScreen }
];

// IMPORTANT
// CHANGE ./components/State.js TO SET THE BASE URL AND REFRESH ROUTE, currently its set to localhost:3333

// DEFAULTS ARE: POST| /login { email, password }, /register { email, password }, /refresh { token }

// PROTECTED routes use the headers: { Authorization: `Bearer ${token}` }, the  /login returns a refresh token and a token
// The token has the expire date and the user id, the refresh token is a random string that is used to get a new token
  // When the token expires, the app automagically hits up the /refresh route and gets a new token (if everything checks out)
  // the nodejs server has an expiration date for the refresh tokens, this is so we can auto log people out after X time (15 days)
  // that time is set in NodeJS using Redis

// So first you log in, get a refresh and token, then you use the token to access protected routes

export default function App() {  
  return (
    <AppContextProvider>
      <OrientationListeners />
      <AuthNavigation screens={screens} styles={styles} />
    </AppContextProvider>
  );
}
