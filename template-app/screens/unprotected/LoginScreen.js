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