import LoginScreen from '../screens/unprotected/LoginScreen';
import RegisterScreen from '../screens/unprotected/RegisterScreen';
import ForgotPasswordScreen from '../screens/unprotected/ForgotPasswordScreen';
import React, { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createElements } from '../utils/elements';
import { setupProtectedHttpUtil } from '../utils/httpUtil';
import { AppContext } from './State';
import tokensManager from '../utils/tokensManager';
let appTokenNames = {
  token: undefined,
  refeshToken: undefined
};
let appBaseUrl = undefined;

const buildHeader = ({ props, screen, styles, appState }) => {
  const initiatedTokensManager = tokensManager(appTokenNames);
  const initializedHttpUtil = setupProtectedHttpUtil({ tokenNames: appTokenNames, baseUrl: appBaseUrl, tokensManager: initiatedTokensManager });

  return (<screen.headerComponent 
      {...props}
      screen={screen}
      styles={styles}
      elements={createElements({...props})}
      appState={appState}
      httpUtil={initializedHttpUtil}
      baseUrl={appBaseUrl}
      tokensManager={initiatedTokensManager}
    />)
  };

const buildScreen = ({Stack, screen, styles, appState}) => {
  const initiatedTokensManager = tokensManager(appTokenNames);
  const initializedHttpUtil = setupProtectedHttpUtil({ tokenNames: appTokenNames, baseUrl: appBaseUrl, tokensManager: initiatedTokensManager });

  function NoiceComponent(props) {
    return (<screen.component 
        {...props}
        screen={screen}
        styles={styles}
        elements={createElements({...props})}
        appState={appState}
        httpUtil={initializedHttpUtil}
        baseUrl={appBaseUrl}
        tokensManager={initiatedTokensManager}
      />)
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
  const appState = useContext(AppContext);
  return (
    <Stack.Navigator>
      {screens.map((screen, i) => {
        screen.key = i;
        if (screen.headerComponent != undefined && screen.headerComponent != null) {
          screen.options = { 
            header: (props) => buildHeader({ props, screen, styles, appState })
          };
        } else {
            screen.options = { headerShown: false };
        }
        return buildScreen({Stack, screen, styles, appState});
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

function AuthNavigation({ screens, styles, tokenNames, baseUrl }) {
    appBaseUrl = baseUrl;
    const Stack = createStackNavigator();
    const { loggedIn } = useContext(AppContext);

    appTokenNames = tokenNames;

    return (
        <NavigationContainer>
            {loggedIn ? buildProtectedNavigator(Stack, screens, styles) : buildUnprotectedNavigator(Stack, styles)}
        </NavigationContainer>
    );
}

export default AuthNavigation;
