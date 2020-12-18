import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert, TouchableOpacity, Modal, ScrollView, Button, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import call from 'react-native-phone-call';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function AppelUrg({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [appelUrg, setAppelUrg] = useState([]);
    const [coleur, setColeur] = useState('black');
    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    
    useEffect(() => {
        setColeur('');
    }, [coleur]);

    useEffect(() => {
        _storeData();
    }, [appelUrg]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'appelUrg',
              JSON.stringify(appelUrg)
            );
            console.log(appelUrg);
        } catch (error) {
            console.log('missed')
        }
    };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('appelUrg');
            if (value !== null) {
                console.log('returned');
                setAppelUrg(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addAppelUrg = (appelUrg) => {
        appelUrg.key = Math.random().toString();
        appelUrg.selected = 0;
        appelUrg.userKey = global.userKey;
        setAppelUrg((currentappelUrg) => {
            return [appelUrg, ...currentappelUrg];
        });
        try {
            db.collection('appelUrg').doc(appelUrg.key).set({
                key: appelUrg.key,
                userKey: appelUrg.userKey,
                selected: appelUrg.selected,
                telephone: appelUrg.telephone,
            });
            console.log('added to firebase');
        } catch (error) {
            console.log('firebase error');
        }
        setModalOpen(false);
    }

    const updateSelected = (v) => {

        appelUrg.forEach(element => {
            if(element.key == v.key){
                db.collection('appelUrg').doc(v.key).update({
                    selected: 1
                })
            }else{
                db.collection('appelUrg').doc(element.key).update({
                    selected: 0
                })
                element.selected = 0;
            }
        })
    }

    const supprimerAlert = (key) => {
        Alert.alert('supprimer','êtes-vous sûr de vouloir supprimer ce contenu?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (supprimer(key))}
        ]);
    }

    const supprimer = (key) => {
        console.log(key);
        setAppelUrg((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('appelUrg').doc(key).delete();
    }
    
    //appel
    const phonecall = () => {
        appelUrg.forEach(element => {
            if(element.selected == 1){
                const args = {
                    number: element.telephone, // String value with the number to call
                    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
                }
                phonecallmsg(args);
            }
        });
    }

    const phonecallmsg = (args) => {
        Alert.alert('appel','êtes-vous sûr de vouloir appelez ce numiro?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (call(args).catch(console.error))}
        ]);
    }

    const appelUrgSchema = yup.object({
        telephone: yup.number().required().max(99999999999),
    })

        return(
            <View style={ globalStyles.container }>
                <Button title="appelez l'urgence" onPress={()=>phonecall()} />
                <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <ScrollView>
                                    <Formik
                                    initialValues={{ telephone:'' }}
                                    validationSchema={appelUrgSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addAppelUrg(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie la numero de telephone"
                                                    onChangeText={props.handleChange('telephone')}
                                                    value={props.values.telephone}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('telephone')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.telephone && props.errors.telephone }</Text>

                                                <Button title='submit' color='maroon' onPress={props.handleSubmit} />
                                            </View>
                                        )}
                                    </Formik>
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Ionicons name="ios-add-circle"  size={45} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>
                <TouchableOpacity onPress={ () => setmodelOpen(true)} >
                    <Text style={styles.text}>Ajouter un numero de téléphone</Text>
                </TouchableOpacity>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />
                <FlatList
                data={appelUrg}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.telephone.startsWith(text))
                    return(
                    <View style={styles.non}>


                        <TouchableOpacity onPress={() => {const args = {number: item.telephone, prompt: false}; phonecallmsg(args)} }>
                        <Card>
                            <Text style={styles.styletext}>{item.telephone}</Text>
                        </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if(item.selected==0){
                                item.selected=1;
                                updateSelected(item);
                                _storeData();
                                setColeur('red');
                            }
                        }}>
                            <Image style={globalStyles.like} source={images.likes[item.selected]} />
                        </TouchableOpacity>
                        <Ionicons name='ios-trash' size={55} style={styles.supp} onPress={() => supprimerAlert(item.key)}/>
                    </View>
                )}}
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
        fontSize:17,
        color:"#333",
        textAlign:'center',
        marginBottom:23,
        width:190,
        height :25,
    },
    text:{
        textAlign:'center',
        color:"#333",
        fontSize:20,
        marginBottom:10,
    },
    supp: {
        color: '#fdcb9e',
    },
});