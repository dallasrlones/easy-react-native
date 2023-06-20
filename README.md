# easy-react-native
This makes creating apps EASY. This basically for me to quickly grab off the interwebs so it might have some shidiot things left in there, I will clean it up eventually 😵‍💫

## Starting
The server is running in docker along with psql so starting that is as easy as get docker and then:
```terminal
cd template-server
docker-compose up --build
```

The apps are built with Expo so starting the apps is as easy as:
```terminal
cd template-app
yarn android
yarn ios
```

Press r to reload live with Expo (pretty shmexy)

# Intro
There are 2 systems, the apps and the API

## Apps
By default the apps come with JWT based authentication / registration that connects directly to the server.
The app also has an elements util that replicates HTML elements, and injects awesome shiz into the screen. For example:

### Example

```jsx
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
```

## Server
The server is setup with 1 route, a POST to /payload. This makes it super simple to fetch information or do actions by just passing in an action and a payload.

### Example
```js
// this comes from the apps, hitting the server at /payload
httpThingy.post('/payload', { action: 'GET_USER_FRIENDS', payload: { friends_that_like_cake: true } });
```

### You can also see an exmaple of how to easily add an action handler to the payload route:
```js
import userService from '../services/users.js';

const userActions = {};

userActions.GET_USER = (req, res) => {
  res.json({ success: true, user: req.user });
};

export default userActions;

```

Each action is basically its own route, and you can respond with anything you want. Try to keep the { success: true, ... } design pattern because its sexy.

### Server.js
The idea of this is that server.js is very lightweight, all of your actions will be in separate files.

```js
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import authController from './controllers/authController.js';
const { loginHandler, registerHandler, forgotPasswordHandler, decodeJwtMiddleware } = authController;
import actions from './actions/index.js';
// run migrations in ./services/migrations.js feel free to change these to meet your eneds
import './services/migrations.js'

const server = express();
server.use(express.static(path.resolve('./public')));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get('/', (_req, res) => res.json({ success: true }));

server.post('/login', loginHandler);
server.post('/register', registerHandler);
server.post('/forgot-password', forgotPasswordHandler);

server.post('/payload', decodeJwtMiddleware, (req, res) => {
    const action = actions[req.body.action] || null;
    if (action == null) {
        res.json({ success: false, message: 'action not in there bud, add it to /actions/index' });
    } else {
        delete req.body.action;
        action(req, res);
    }
});

server.listen(process.env.PORT || 1337, err => {
    console.log(err || 'Server running on port 1337')
});
```

# ELEMENTS

### BTN
```jsx
//onPress is handled with the success payload from the request
<BTN style, onPress, src, onError, headers>
    Click Here
</BTN>
```

### SUBMIT
```jsx
<SUBMIT style, onPress, src, headers, onError, payload>
    Submit Form
</SUBMIT>
```

### VISBLE

### DIV
```jsx
// ! both, children must be text or components
<DIV>Text</DIV>
<DIV><OrComponents /></DIV>
```

### SPAN

### CENTER

### BR

### HR

### H1

### H2

### H3

### H4

### H5

### H6

### P

### A

### UL

### OL

### LI

### CHECKBOX

### RADIO

### OPTIONS

### SELECT

### HSPLIT

### ICON

### EMAIL

### PASSWORD
