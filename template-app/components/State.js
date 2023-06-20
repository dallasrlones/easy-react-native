import { createContext, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { tokenExists } from "../utils/tokensManager";

const AppContext = createContext();

function AppContextProvider({ children, tokenNames, customStateHooks }) {
    const [orientation, setOrientation] = useState("PORTRAIT");
    const [loggedIn, setLoggedIn] = useState(false);
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

        tokenExists(tokenNames.token).then(tokenExists => {
            setLoggedIn(tokenExists);
        }).catch(err => {
            alert(JSON.stringify(err))
        });
    }, [orientation]);

    const appState = {
        orientation, setOrientation,
        loggedIn, setLoggedIn,
        screenDimensions,
        screenType,
        ...customStateHooks
    };

    return (
        <AppContext.Provider value={appState}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppContextProvider };