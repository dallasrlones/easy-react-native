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
const { useContext, useState, useEffect } = require('react');
const { AppContext } = require('../../components/State');
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginScreen({ navigation, elements, styles,  appState }) {
    const { setLoggedIn } = appState;
    const { VISIBLE, CENTER, SUBMIT, DIV, SPAN, BR, H1, A, EMAIL, PASSWORD } = elements;
    const { colors } = styles;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const payload = { email, password };

    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const loginClickHandler = (res) => {
        if (res.success === true) {
            // handle token
            AsyncStorage.setItem('token', res.token).then(() => {
                AsyncStorage.setItem('refreshToken', res.refreshToken).then(() => {
                    setLoggedIn(true);
                });
            });
        }
    };

    const loginErrorHandler = (err) => {
        alert(JSON.stringify(err))
        setErrorMessage(err.message);
        setDisplayErrorMessage(true);
    };

    const darkBkg = { backgroundColor: colors.dark };
    const darkText = { color: colors.dark };

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <VISIBLE isVisible={displayErrorMessage}>
                <CENTER type="horizontal">
                    <SPAN>{errorMessage}</SPAN>
                </CENTER>
            </VISIBLE>
            
            <DIV style={{width: 250 }}>
                <H1 style={darkText}>Login</H1>
                <EMAIL onChange={setEmail} isValid={true} setValid={() => {}} placeholder={"email@address.com"} />
                <BR />
                <PASSWORD changed={setPassword} isValid={true} setValid={() => {}} placeholder={"Password"} />
                <BR />
                <SUBMIT style={darkBkg} onPress={loginClickHandler} src="http://localhost:1337/login" onError={loginErrorHandler} payload={payload} >Log In</SUBMIT>
            </DIV>

            <DIV style={{ }}>
                <BR />
                <SPAN>Don't have an account? <A style={{ color: colors.dark, fontWeight: 'bold' }} screen="Register" navigation={navigation}>Register</A></SPAN>
            </DIV>
        </CENTER>
    )
}

export default LoginScreen;
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
