import { createContext, useEffect, useState } from "react";
import { Dimensions } from "react-native";
// async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

function AppContextProvider({ children }) {
    const [orientation, setOrientation] = useState("PORTRAIT");
    const [loggedIn, setLoggedIn] = useState(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            return true;
        } else {
            return false;
        }
    });
    const [screenDimensions, setScreenDimensions] = useState({ height: 0, width: 0 });
    const [screenType, setScreenType] = useState("PHONE"); // PHONE, TABLET, DESKTOP

    useEffect(() => {
        if (orientation === 'HORIZONTAL') {
            setScreenDimensions({ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height });
        } else {
            setScreenDimensions({ height: Dimensions.get('screen').height, width: Dimensions.get('screen').width });
        }

        if (screenDimensions.width > 1280) {
            setScreenType("DESKTOP");
        } else if (screenDimensions.width > 600) {
            setScreenType("TABLET");
        } else {
            setScreenType("PHONE");
        }

    }, [orientation]);

    const appState = {
        orientation, setOrientation,
        loggedIn, setLoggedIn,
        screenDimensions,
        screenType
    };

    return (
        <AppContext.Provider value={appState}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppContextProvider };