import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }


export default function AntecedentsFamiliaux({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [anFams, setAnFams] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [anFams,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'anFams',
              JSON.stringify(anFams)
            );
            console.log(anFams);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('anFams');
            if (value !== null) {
                console.log('returned');
                setAnFams(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addAnFams = (anFams) => {
        anFams.key = Math.random().toString();
        anFams.userKey = global.userKey;
        setAnFams((currentanFams) => {
            return [anFams, ...currentanFams];
        });
        try {
            db.collection('anFams').doc(anFams.key).set({
                key: anFams.key,
                userKey: anFams.userKey,
                nomMF: anFams.nomMF,
                rolation: anFams.rolation,
                nomMl: anFams.nomMl
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
        setAnFams((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('anFams').doc(key).delete();
    }

    const anFamSchema = yup.object({
        nomMF: yup.string().required().min(2).max(60),
        rolation: yup.string().required().min(2).max(60),
        nomMl: yup.string().required().min(2).max(60),
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
                                    initialValues={{ nomMF:'', rolation:'', nomMl:'' }}
                                    validationSchema={anFamSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addAnFams(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de membre de famille'
                                                    onChangeText={props.handleChange('nomMF')}
                                                    value={props.values.nomMF}
                                                    onBlur={props.handleBlur('nomMF')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMF && props.errors.nomMF }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='votre relations entre ce membre'
                                                    onChangeText={props.handleChange('rolation')}
                                                    value={props.values.rolation}
                                                    onBlur={props.handleBlur('rolation')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.rolation && props.errors.rolation }</Text>


                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de maladie'
                                                    onChangeText={props.handleChange('nomMl')}
                                                    value={props.values.nomMl}
                                                    onBlur={props.handleBlur('nomMl')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMl && props.errors.nomMl }</Text>
                                                <Button title='submit' color='maroon' onPress={props.handleSubmit} />
                                            </View>
                                        )}
                                    </Formik>
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='add' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={anFams}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomMF.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('AntecedentsFamiliauxDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomMF}</Text>
                            </Card>
                        </TouchableOpacity>
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f2f2f3',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    modalClose: {
        marginBottom: 0,
        marginTop: 20,
    },
    searchInput:{
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
});