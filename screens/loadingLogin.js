import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
export default function LoadingLogin({navigation}){


    return(
        <View style={ globalStyles.container }>
            <Image source={require('../assets/rating-1.png')} />
        </View>
    )
}

const styles = StyleSheet.create ({
    modalContainer:{
        flex: 1,
    },
    modalToggle:{
        borderWidth: 1,
        borderColor: '#f2f2f3',
        borderRadius: 10,
        alignSelf: 'center',
    },
    modalClose: {
        marginBottom: 0,
        marginTop: 20,
    },
    searchInput:{
        padding: 10,
        marginBottom:20,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    non:{
        flexDirection:'row',
      },
    styletext: { 
        fontSize:22,
        color:"#333",
        textAlign:'center',
        borderWidth :3,
        borderRadius:10 ,
        marginBottom:23,
        borderColor:'black',
        width:220,
        height :55,
    },
    text:{
        textAlign:'center',
        color:"#333",
        fontSize:20,
        marginBottom:10,
    },
});