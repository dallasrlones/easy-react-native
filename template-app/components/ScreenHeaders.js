import { SafeAreaView, Modal } from 'react-native';
const { useState } = require("react");

const PrimaryScreenHeader = ({ screen, styles, elements, navigation }) => {
    const { DIV, H1, ICON, A } = elements;
    const [navModalVisible, setNavModalVisible] = useState(false);

    const navigationMenuClickHandler = () => {
        setNavModalVisible(true);
    };

    return (
        <SafeAreaView style={{ backgroundColor: styles.colors.dark, height: 60 }}>
            <DIV style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                <H1 style={{ color: 'white', paddingLeft: 20, marginTop: 7 }}>{screen.name}</H1>

                <DIV style={{ paddingRight: 25, paddingTop: 7 }}>
                    <ICON onPress={navigationMenuClickHandler} name="menufold" size={30} color="white" />
                </DIV>
            </DIV>

            <Modal visible={navModalVisible} animationType="slide">
                <A navigation={navigation} screen='Logout' onPress={() => { setNavModalVisible(false) }}>Logout</A>
            </Modal>
        </SafeAreaView>
    );
};

export { PrimaryScreenHeader };
