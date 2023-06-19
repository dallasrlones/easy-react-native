import LoginScreen from '../screens/unprotected/LoginScreen';
import RegisterScreen from '../screens/unprotected/RegisterScreen';
import ForgotPasswordScreen from '../screens/unprotected/ForgotPasswordScreen';
import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import elementsUtil from '../utils/elements';
import httpUtil from '../utils/httpUtil';
import { AppContext } from './State';

const buildScreen = (Stack, screen, styles) => {
  function NoiceComponent(props) {
    const appState = useContext(AppContext);
    return (
      <screen.component {...props} elements={elementsUtil} httpUtil={httpUtil} styles={styles} appState={appState} />
    )
  }

  return (
    <Stack.Screen
      key={screen.key}
      name={screen.name}
      component={NoiceComponent}
      options={screen.options}
    />
  );
};

const buildStackNavigator = (Stack, screens, styles) => {
  return (
    <Stack.Navigator>
      {screens.map((screen, i) => {
        screen.key = i;
        if (screen.headerComponent != undefined && screen.headerComponent != null) {
          screen.options = { header: (props) => (<screen.headerComponent {...props} screen={screen} styles={styles} elements={elementsUtil} httpUtil={httpUtil} />) };
        } else {
            screen.options = { headerShown: false };
        }
        return buildScreen(Stack, screen, styles);
      })}
    </Stack.Navigator>
  )
};

const buildProtectedNavigator = (Stack, screens, styles) => {
  return buildStackNavigator(Stack, screens, styles);
};

const buildUnprotectedNavigator = (Stack, styles) => {
  const screens = [
    { name:"Login", component: LoginScreen },
    { name:"Register", component: RegisterScreen },
    { name:"ForgotPassword", component: ForgotPasswordScreen }
  ];
  return buildStackNavigator(Stack, screens, styles);
};

function AuthNavigation({ screens, styles }) {    
    const Stack = createStackNavigator();
    const { loggedIn } = useContext(AppContext);
    return (
        <NavigationContainer>
            {loggedIn ? buildProtectedNavigator(Stack, screens, styles) : buildUnprotectedNavigator(Stack, styles)}
        </NavigationContainer>
    );
}

export default AuthNavigation;
