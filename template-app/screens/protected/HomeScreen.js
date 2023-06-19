const HomeScreen = ({ elements, httpUtil, styles, appState }) => {
    const { DIV, CENTER, H1 } = elements;

    return (
        <CENTER type="both" style={{ height: '100%', width: '100%' }}>
            <H1 style={{ color: styles.colors.dark }}>Welcome Home!</H1>
        </CENTER>
    )
};
export default HomeScreen;