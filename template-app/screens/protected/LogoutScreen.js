import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ elements, appState }) => {
    const { setLoggedIn } = appState;
    const { DIV, CENTER } = elements;

    useEffect(() => {
        AsyncStorage.removeItem('token').then(() => {
            AsyncStorage.removeItem('refreshToken').then(() => {
                setLoggedIn(false);
            });
        });
    }, []);

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <DIV>Logging out...</DIV>
        </CENTER>
    );
};

export default LogoutScreen;