import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';

export default function Header({ navigation, title }) {

    const openMenu = () => {
        navigation.openDrawer()
    };

    
    const clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }

    const logout = () => {
        navigation.navigate('UserLogin');
    };

    return(
        <View style={styles.header}>
            <MaterialIcons name='menu' size={28} onPress={openMenu } style={styles.icon} />
            <View style={styles.headerTitle}>
                <Text style={styles.headerText}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width:Dimensions.get('screen').width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
        letterSpacing: 1,
    },
    icon: {
        position: 'absolute',
        left: 1,
    },
    iconLogout: {
        position: 'relative',
        right: 1,
    },
    headerImage: {
        width:26,
        height:26,
        marginRight: 4,
    },
    headerTitle: {
        flexDirection: 'row',
    },
});