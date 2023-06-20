import { useState, useEffect } from 'react';

const HomeScreen = ({ elements, httpUtil, styles, appState }) => {
    const { DIV, CENTER, H1 } = elements;
    const [userInfo, setUserInfo] = useState({});

    const { PAYLOAD } = httpUtil;

    useEffect(() => {
        PAYLOAD('GET_USER').then(res => {
            if (res.success == true) {
                setUserInfo(res.user);
            }
        }).catch(err => {
            alert(JSON.stringify(err.message));
        });
    }, [])

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <H1 style={{ color: styles.colors.dark }}>Welcome Home!</H1>
            <DIV>{userInfo.email}</DIV>
            <DIV>{appState.currentTask}</DIV>
        </CENTER>
    )
};
export default HomeScreen;