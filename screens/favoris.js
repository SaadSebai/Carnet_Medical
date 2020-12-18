import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function Favoris({navigation, route}){

    var db = firebase.firestore();
    
    const [list, setList] = useState([]);
    const [text, setText] = useState('');
    const [detailsName, setDetailsName] = useState('');
    const [listName, setListName] = useState('');
    const [reload, setReload] = useState('');

    useEffect(() => {
        _storeData(listName);
    }, [route]);

    useEffect(() => {
        setReload('');
    }, [reload]);

    const _storeData = async (val) => {
        try {
            await AsyncStorage.setItem(
                val,
                JSON.stringify(list)
            );
            console.log(list);
          } catch (error) {
            console.log('missed')
          }
      };

    const changeDetails = (val) => {
        if(val == 'hopitaux')
            setDetailsName('FavoriHopitauxDetails');
        if(val == 'pharmacies')
            setDetailsName('FavoriPharmaciesDetails');
        if(val == 'servicesUrgs')
            setDetailsName('FavoriServicesUrgsDetails');
        if(val == 'medecins')
            setDetailsName('FavoriMedecinsDetails');
        if(val == 'laboratoires')
            setDetailsName('FavoriLaboratoiresDetails');
    }

    const _retrieveData = async (val) => {
        try {
            const value = await AsyncStorage.getItem(val);
            if (value !== null) {
                console.log('returned');
                setList(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const supprimer = () => {
        list.forEach(element =>{
            setList((prev) => {
                return prev.filter(am => am.key != element.key)
            })
        })
    }
    const updatefavori = (v) => {
        db.collection(listName).doc(v.key).update({
            favori: v.favori
        })
    }

    return(
        <View style={ globalStyles.container }>
            <View style={ styles.picker }>
                <RNPickerSelect
                    onValueChange={(value) => {if(value == null){supprimer();}else{setListName(value);supprimer();_retrieveData(value); changeDetails(value);}}}
                    style={{ ...pickerSelectStyles }}
                    placeholder={{
                        label: 'Entrez votre choix',
                        value: null,
                    }}
                    items={[
                        { label: 'Hôpitaux et cliniques', value: 'hopitaux' },
                        { label: 'Pharmacies', value: 'pharmacies' },
                        { label: 'Médecins', value: 'medecins' },
                        { label: "Services d'urgence", value: 'servicesUrgs' },
                        { label: 'Laboratoires', value: 'laboratoires' },
                    ]}
                />
            </View>

            <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

            <FlatList
            data={list}
            renderItem={({ item }) => {
                if(item.favori == 1){
                    if(item.nom.startsWith(text))
                    return(
                    <View style={styles.non}>

                        <TouchableOpacity onPress={() => {
                                item.favori=0;
                                updatefavori(item);
                                _storeData(listName);
                                setReload('loading');
                        }}>
                            <Image style={globalStyles.like} source={images.likes[1]} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate(detailsName, item) }>
                            <Text style={styles.styletext}>{item.nom}</Text>
                        </TouchableOpacity>
                    </View>
            )}}}
            />
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
    picker: {
        borderRadius: 6,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

const pickerSelectStyles = StyleSheet.create({

    inputIOS: {
        fontSize: 19,
        backgroundColor: '#f5f5f5',
        color: 'black',
    },
    inputAndroid: {
        fontSize: 19,
        backgroundColor: '#f5f5f5',
        color: 'black',
    },

});