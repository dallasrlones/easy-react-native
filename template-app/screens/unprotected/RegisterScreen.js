const { useContext, useState, useEffect } = require('react');
const { AppContext } = require('../../components/State');


function RegisterScreen({ navigation, elements: { VISIBLE, CENTER, SUBMIT, DIV, SPAN, BR, H1, A, EMAIL, PASSWORD } }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const payload = { email, password };

    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const loginClickHandler = (res) => {
        if (res.success === true) {
            navigation.navigate('Login');
        } else {
            setErrorMessage(res.message);
            setDisplayErrorMessage(true);
        }
    };

    const loginErrorHandler = (err) => {
        setErrorMessage(err.message);
        setDisplayErrorMessage(true);
    };

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <VISIBLE isVisible={displayErrorMessage}>
                <CENTER type="horizontal">
                    <SPAN>{errorMessage}</SPAN>
                </CENTER>
            </VISIBLE>
            
            <DIV style={{width: 250 }}>
                <H1 style={{ color: '#3d3d3d' }}>Register</H1>
                <EMAIL onChange={setEmail} isValid={true} setValid={() => {}} placeholder={"email@address.com"} />
                <BR />
                <PASSWORD changed={setPassword} isValid={true} setValid={() => {}} placeholder={"Password"} />
                <BR />
                <PASSWORD changed={setPassword} isValid={true} setValid={() => {}} placeholder={"Password"} />
                <BR />
                <SUBMIT style={{ backgroundColor: '#3d3d3d' }} onPress={loginClickHandler} src="http://localhost:1337/register" onError={loginErrorHandler} payload={payload} >Register</SUBMIT>
            </DIV>

            <DIV style={{ }}>
                <BR />
                <SPAN>Already have an account? <A style={{ color: '#1d1d1d', fontWeight: 'bold' }} screen="Login">Log In</A></SPAN>
            </DIV>
        </CENTER>
    )
}

export default RegisterScreen;