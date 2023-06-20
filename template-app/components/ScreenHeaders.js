import { SafeAreaView, Text, Modal, TouchableOpacity } from 'react-native';
const { useState, useEffect } = require("react");

const PrimaryScreenHeader = ({ screen, styles, elements, navigation }) => {
    const { DIV, H1, ICON} = elements;

    const navigationMenuClickHandler = () => {
        navigation.navigate('PrimaryNavigation');
    };

    return (
        <SafeAreaView style={{ backgroundColor: styles.colors.dark, height: 60 }}>
            <DIV style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                <H1 style={{ color: 'white', paddingLeft: 20, marginTop: 7 }}>{screen.name}</H1>

                <DIV style={{ paddingRight: 25, paddingTop: 7 }}>
                    <ICON onPress={navigationMenuClickHandler} name="menufold" size={30} color="white" />
                </DIV>
            </DIV>
        </SafeAreaView>
    );
};

const AdminScreeHeader = ({ screen, styles, elements, navigation }) => { };

const AccountingScreenHeader = ({ screen, styles, elements, navigation }) => { };

const InflowOutflowScreenHeader = ({ screen, styles, elements, navigation }) => { };

const BrandsScreenHeader = ({ screen, styles, elements, navigation }) => { };

const SettingsScreenHeader = ({ screen, styles, elements, navigation }) => { };

export { PrimaryScreenHeader, AdminScreeHeader, AccountingScreenHeader, InflowOutflowScreenHeader, BrandsScreenHeader, SettingsScreenHeader };
