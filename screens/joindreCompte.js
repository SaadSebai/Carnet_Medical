import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import Card from '../Shared/card';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function JoindreCompte({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [joindreComptes, setJoindreComptes] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [joindreComptes,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'joindreComptes',
              JSON.stringify(joindreComptes)
            );
            console.log(joindreComptes);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('joindreComptes');
            if (value !== null) {
                console.log('returned');
                setJoindreComptes(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addJoindreCompte = (joindreComptes) => {
        joindreComptes.key = Math.random().toString();
        joindreComptes.userKey = global.userKey;
        setJoindreComptes((currentjoindreComptes) => {
            return [joindreComptes, ...currentjoindreComptes];
        });
        try {
            db.collection('joindreComptes').doc(joindreComptes.key).set({
                key: joindreComptes.key,
                userKey: joindreComptes.userKey,
                nom: joindreComptes.nom,
                prenom: joindreComptes.prenom,
                age: joindreComptes.age,
                groupesanguin: joindreComptes.groupesanguin
            });   
        } catch (error) {
            console.log('firebase error');
        }
        setModalOpen(false);
    }

    const supprimerAlert = (key) => {
        Alert.alert('supprimer','êtes-vous sûr de vouloir supprimer ce contenu?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (supprimer(key))}
        ]);
    }

    const supprimer = (key) => {
        console.log(key);
        setJoindreComptes((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('joindreComptes').doc(key).delete();
    }

    const joindreCompteSchema = yup.object({
        nom:yup.string().required().min(3),
        prenom:yup.string().required().min(3),
        age: yup.number().required().test('testMesure', 'the age should be between 0 and 500', (val) => {
            return val < 501 && val >= 0 ;
        }),
        groupesanguin :yup.string().required().min(5),
    })

        return(
            <View style={ globalStyles.container }>
                <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                <ScrollView>    
                                    <Formik
                                    initialValues={{ nom:'', prenom:'', age:'', groupesanguin:'' }}
                                    validationSchema={joindreCompteSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addJoindreCompte(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie le nom"
                                                    onChangeText={props.handleChange('nom')}
                                                    value={props.values.nom}
                                                    onBlur={props.handleBlur('nom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nom && props.errors.nom }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie le prenom"
                                                    onChangeText={props.handleChange('prenom')}
                                                    value={props.values.prenom}
                                                    onBlur={props.handleBlur('prenom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.prenom && props.errors.prenom }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie l'age"
                                                    onChangeText={props.handleChange('age')}
                                                    value={props.values.age}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('age')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.age && props.errors.age }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie le groupe sanguin"
                                                    onChangeText={props.handleChange('groupesanguin')}
                                                    value={props.values.groupesanguin}
                                                    onBlur={props.handleBlur('groupesanguin')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.groupesanguin && props.errors.groupesanguin }</Text>

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
                    <Text style={styles.text}>Joindre un compte</Text>
                </TouchableOpacity>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={joindreComptes}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nom.startsWith(text))
                    return(
                    <View style={styles.non}>
                        
                        <TouchableOpacity onPress={() => navigation.navigate('JoindreComptesDetails', item) }>
                            <Card>
                                <Text style={styles.styletext}>{item.nom} {item.prenom}</Text>
                            </Card>
                        </TouchableOpacity>
                        <Ionicons name='ios-trash' size={50} style={styles.supp} onPress={() => supprimerAlert(item.key)}/>
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
        width:230,
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