import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useState, useContext } from 'react';
import HttpUtil from './httpUtil';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const createElements = ({ navigation }) => {
    const elements = {};

    const monthsHash = {
        0: 'January',
        1: 'Febuary',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    };

    const styles = StyleSheet.create({
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        h3: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        h4: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        h5: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        h6: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        p: {
            fontSize: 16,
        },
        a: {},
        ul: {
            paddingLeft: 25,
        },
        ol: {
            paddingLeft: 25,
        },
        li: {
            marginBottom: 5,
        },
        img: {
            resizeMode: 'contain',
        },
        audio: {},
        video: {},
        checkboxContainer: {
            width: 25,
            height: 25,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkboxChecked: {
            width: 15,
            height: 15,
            backgroundColor: 'black',
            borderRadius: 5,
        },
        radioContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        radioButton: {
            width: 25,
            height: 25,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioButtonSelected: {
            backgroundColor: 'black',
        },
        radioLabel: {
            marginLeft: 10,
        },
        selectContainer: {
            width: 200,
            height: 50,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectButton: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectText: {
            fontSize: 16,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
        },
        optionButton: {
            width: '100%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        optionText: {
            fontSize: 16,
        },
        button: {
            width: 50,
            height: 50,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
        },
        modalButton: {
            width: 100,
            height: 50,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalButtonText: {
            color: 'white',
            fontSize: 16,
        }
    });

    elements.VISIBLE = ({ children, isVisible, onPress }) => {
        return isVisible ? <View onPress={onPress}>{children}</View> : null
    }

    elements.DIV = ({ children, style }) => {
        const childrenIsString = typeof children === 'string';

        return (
            <View style={style}>
                {childrenIsString ? <Text>{children}</Text> : children}
            </View>
        )
    };

    elements.SPAN = ({ children, style, onPress }) => (<Text style={style} onPress={onPress}>{children}</Text>)

    elements.CENTER = ({ children, style, onPress, type }) => {
        if (type == 'both') {
            return (
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style }} onPress={onPress}>
                    {children}
                </View>
            )
        }

        if (type == undefined || type == 'horizontal') {
            return (
                <View style={{ flexDirection: 'column', alignItems: 'center', ...style }} onPress={onPress}>
                    {children}
                </View>
            )
        }

        if (type == 'vertical') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center', ...style }} onPress={onPress}>
                    {children}
                </View>
            )
        }
    };

    elements.BR = ({ size, onPress }) => {
        return <View style={{ marginTop: size || 5, marginBottom: size || 5 }} onPress={onPress}></View>
    };

    elements.HR = ({ color, margin, onPress }) => {
        return <View onPress={onPress} style={{ borderBottomColor: color || 'black', borderBottomWidth: 1, marginTop: margin || 5, marginBottom: margin || 5 }}></View>
    };

    elements.H1 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h1, style]}>{children}</Text>
    };

    elements.H2 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h2, style]}>{children}</Text>
    };

    elements.H3 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h3, style]}>{children}</Text>
    };

    elements.H4 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h4, style]}>{children}</Text>
    };

    elements.H5 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h5, style]}>{children}</Text>
    };

    elements.H6 = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.h6, style]}>{children}</Text>
    };

    elements.P = ({ children, style, onPress }) => {
        return <Text onPress={onPress} style={[styles.p, style]}>{children}</Text>
    };

    elements.A = ({ children, style, screen, onPress }) => {
        // if children is a string then it is the text of the link
        if (typeof children === 'string') {
            return <Text style={style} onPress={() => {
                if (onPress) {
                    onPress();
                }
                navigation.navigate(screen);
            }}>{children}</Text>
        }

        return <TouchableOpacity style={[styles.a, style]} onPress={() => { 
            if (onPress != undefined) {
                onPress();
            }
            navigation.navigate(screen)
        }}>{children}</TouchableOpacity>
    };

    elements.UL = ({ children, style, onPress }) => {
        return (
            <View style={[styles.ul, style]}>
                {/* map through children to add the bullets */}
                {children.map((child, index) => {
                    return (
                        <View style={{ flexDirection: 'row' }} onPress={() => onPress(child.props.children)}>
                            <Text style={{ marginRight: 5 }}>•</Text>
                            {child}
                        </View>
                    )
                })}
            </View>
        );
    }

    elements.OL = ({ children, style, onPress }) => {
        return <View style={[styles.ol, style]}>
            {/* map through children to add the numbers */}
            {children.map((child, index) => {
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginRight: 5 }} onPress={() => onPress(child.props.children)}>{index + 1}.</Text> {child}
                    </View>
                )
            })}
        </View>
    };

    elements.LI = ({ children, style, onPress }) => {
        return <View onPress={onPress} style={[styles.li, style]}>{children}</View>
    }

    const btnStyles = StyleSheet.create({
        btn: {
            backgroundColor: 'grey',
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 5,
            alignItems: 'center',
            alignSelf: 'flex-start',
        },
        btnText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    elements.BTN = ({ children, style, onPress, src, findOptions, onError, headers }) => {
        let newOnPress = undefined;
        if (src && !findOptions) {
            newOnPress = () => {
                HttpUtil.GET(src, headers || {}).then((res) => {
                    onPress(res);
                }).catch(onError);
            };
        }

        if (!src && findOptions) {
            newOnPress = () => {
                dbMan.getItems(findOptions).then((res) => {
                    onPress(res);
                }).catch(onError);
            };
        }

        return (
            <TouchableOpacity style={[btnStyles.btn, style]} onPress={newOnPress || onPress}>
                <Text style={btnStyles.btnText}>{children}</Text>
            </TouchableOpacity>
        );
    };

    elements.SUBMIT = ({ children, style, onPress, src, headers, setOptions, onError, payload, findOptions }) => {
        let newOnPress = undefined;
        if (src && !findOptions) {
            newOnPress = () => {
                HttpUtil.POST(src, headers || {}, payload).then((res) => {
                    onPress(res);
                }).catch(onError);
            };
        }

        if (!src && findOptions) {
            newOnPress = () => {
                dbMan.setItems(setOptions, payload).then((res) => {
                    onPress(res);
                }).catch(onError);
            };
        }

        return (
            <TouchableOpacity style={[btnStyles.btn, style]} onPress={newOnPress || onPress}>
                <Text style={btnStyles.btnText}>{children}</Text>
            </TouchableOpacity>
        );
    };

    elements.CHECKBOX = ({ checked, onChange }) => {
        const [isChecked, setIsChecked] = useState(checked);

        const handleCheckboxPress = () => {
            const newChecked = !isChecked;
            setIsChecked(newChecked);

            if (onChange) {
                onChange(newChecked);
            }
        };

        return (
            <TouchableOpacity onPress={handleCheckboxPress} activeOpacity={1}>
                <View style={styles.checkboxContainer}>
                    {isChecked && <View style={styles.checkboxChecked} />}
                </View>
            </TouchableOpacity>
        );
    };

    elements.RADIO = ({ name, selected, onChange }) => {
        const handleRadioPress = () => {
            if (onChange) {
                onChange(name);
            }
        };

        return (
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={[styles.radioButton, selected && styles.radioButtonSelected]}
                    onPress={handleRadioPress}
                />
                <Text style={styles.radioLabel}>{name}</Text>
            </View>
        );
    };

    // Option
    elements.OPTIONS = ({ name, value, children }) => {
        return <View value={value}>{
            name ? (<Text>Name</Text>) : children
        }</View>
    };

    //   Select with children of <Option> components
    elements.SELECT = ({ children, onChange, placeholder, usesModal, style, modalStyle }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedValue, setSelectedValue] = useState('');

        const handleOpenModal = () => {
            setIsOpen(true);
        };

        const handleCloseModal = () => {
            setIsOpen(false);
        };

        const handleOptionSelect = (value, text) => {
            setSelectedValue(text);
            onChange(value);
            handleCloseModal();
        };

        function ChildMap({ children }) {
            return children.map((child, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleOptionSelect(child.props.value, child.props.children)}
                    style={styles.optionButton}
                >
                    <Text style={styles.optionText}>{child.props.children}</Text>
                </TouchableOpacity>
            ));
        }

        return (
            <View style={[styles.selectContainer, style]}>
                <TouchableOpacity onPress={handleOpenModal} style={styles.selectButton}>
                    <Text style={styles.selectText}>{selectedValue || (placeholder || 'Select an option')}</Text>
                </TouchableOpacity>

                {usesModal ? (
                    <Modal
                        animationType="slide"
                        visible={isOpen}
                        onRequestClose={handleCloseModal}
                    >
                        <View style={[styles.modalContainer, modalStyle]}>
                            <ScrollView>{ChildMap({ children })}</ScrollView>
                        </View>
                    </Modal>
                ) : (
                    <View style={[styles.modalContainer, modalStyle]}>{ChildMap({ children })}</View>
                )}
            </View>
        );
    };

    const hSplitStyles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'stretch',
        },
        col: {
            alignItems: 'stretch',
        },
    });


    elements.HSPLIT = ({ children, style }) => {
        const validateColWidths = (cols) => {
            const totalWidth = cols.reduce((sum, col) => sum + col.props.colWidth, 0);
            if (totalWidth !== 100) {
                alert('Error', 'The sum of colWidth props must be equal to 100.');
                return false;
            }
            return true;
        };

        if (!validateColWidths(React.Children.toArray(children))) {
            return null;
        }

        return (
            <View style={{ ...hSplitStyles.row, ...style }}>
                {React.Children.toArray(children).map((child, index) => (
                    <View style={[hSplitStyles.col, { flex: child.props.colWidth }]} key={index}>
                        {child}
                    </View>
                ))}
            </View>
        );
    };

    // type is 'ant' 'ion' or 'material'
    elements.ICON = ({ name, size, height, width, color, backgroundColor, borderRadius, type, onPress, style }) => {
        let icon = null;
        if (type === 'ant' || type === undefined) {
            icon = <AntDesign name={name} size={size} color={color} backgroundColor={backgroundColor} borderRadius={borderRadius} />;
        } else if (type === 'ion') {
            icon = <Ionicons name={name} size={size} color={color} backgroundColor={backgroundColor} borderRadius={borderRadius} />;
        } else if (type === 'material') {
            icon = <MaterialCommunityIcons name={name} size={size} color={color} backgroundColor={backgroundColor} borderRadius={borderRadius} />;
        }

        return (
            <TouchableOpacity onPress={onPress} style={{ ...style, height, width }}>
                <Text style={{ height, width, textAlign: 'center', textAlignVertical: 'center' }}>
                    {icon}
                </Text>
            </TouchableOpacity>
        )
    }

    const textInputStyles = StyleSheet.create({
        container: {
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            padding: 10,
        },
        input: {
            height: 20,
        },
        invalidBorder: {
            borderColor: 'red',
        }
    });

    elements.EMAIL = ({ onChange, setValid, placeholder, style, containerStyle }) => {
        const [email, setEmail] = useState('');
        const [isValid, setIsValid] = useState(true);

        const validateEmail = (email) => {
            const emailPattern = /\S+@\S+\.\S+/;
            return emailPattern.test(email);
        };

        const handleEmailChange = (text) => {
            setEmail(text);
            const isValidEmail = validateEmail(text);
            setIsValid(isValidEmail);
            if (setValid) {
                setValid(isValidEmail);
            }
            if (onChange && isValidEmail) {
                onChange(text);
            }
        };

        return (
            <View style={[containerStyle, textInputStyles.container, !isValid && textInputStyles.invalidBorder]}>
                <TextInput
                    style={[textInputStyles.input, style]}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder={placeholder}
                />
            </View>
        );
    };

    elements.PASSWORD = ({ changed, isValid, setValid, placeholder, style, containerStyle }) => {
        const handleInputChange = (text) => {
            const hasValidLength = text.length >= 6;
            const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(text);
            const hasUpperCase = /[A-Z]/.test(text);
            const hasLowerCase = /[a-z]/.test(text);

            const isPasswordValid =
                hasValidLength && hasSpecialCharacter && hasUpperCase && hasLowerCase;

            setValid(isPasswordValid);
            changed(text);
        };

        return (
            <View style={[containerStyle, textInputStyles.container, !isValid && styles.invalidBorder]}>
                <TextInput
                    placeholder={placeholder}
                    style={[styles.input, style]}
                    onChangeText={handleInputChange}
                    secureTextEntry
                />
            </View>
        );
    };

    elements.TEXTAREA = ({ onChange, style, containerStyle, placeholder }) => {

        const inputChangeHandler = (text) => {
            onChange(text);
        };

        return (
            <View style={[containerStyle, textInputStyles.container]}>
                <TextInput
                    style={[styles.input, style]}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={inputChangeHandler}
                    placeholder={placeholder}
                />
            </View>
        )
    };

    elements.GETREQUEST = ({ src, headers, onData, onError }) => {
        HttpUtil.GET(src, headers).then((res) => {
            onData(res);
        }).catch(onError);
    };

    elements.PROTECTEDGETREQUEST = ({ src, headers, onData, onError }) => {
        HttpUtil.PROTECTEDGET(src, headers).then((res) => {
            onData(res);
        }).catch(onError);
    };


    return elements;
};

export { createElements }