import { useEffect } from "react";

const LogoutScreen = ({ elements, appState, tokensManager }) => {
    const { setLoggedIn } = appState;
    const { DIV, CENTER } = elements;

    useEffect(() => {
        tokensManager.clearTokens().then(() => {
            setLoggedIn(false);
        }).catch(err => {
            alert(JSON.stringify(err))
        });
    }, []);

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <DIV>Logging out...</DIV>
        </CENTER>
    );
};

export default LogoutScreen;