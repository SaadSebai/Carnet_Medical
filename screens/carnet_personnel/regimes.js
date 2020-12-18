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

export default function Regimes({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [regms, setRegms] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [regms,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'regms',
              JSON.stringify(regms)
            );
            console.log(regms);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('regms');
            if (value !== null) {
                console.log('returned');
                setRegms(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addRegm = (regms) => {
        regms.key = Math.random().toString();
        regms.userKey = global.userKey;
        setRegms((currentregms) => {
            return [regms, ...currentregms];
        });
        try {
            db.collection('regms').doc(regms.key).set({
                key: regms.key,
                userKey: regms.userKey,
                nomReg: regms.nomReg,
                element: regms.element
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
        setRegms((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('regms').doc(key).delete();
    }

    const regmSchema = yup.object({
        nomReg: yup.string().required().min(4).max(20),
        element: yup.string().required().min(10).max(100),
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
                                    initialValues={{ nomReg:'', element:''}}
                                    validationSchema={regmSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addRegm(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de régime'
                                                    onChangeText={props.handleChange('nomReg')}
                                                    value={props.values.nomReg}
                                                    onBlur={props.handleBlur('nomReg')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomReg && props.errors.nomReg }</Text>

                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    style={globalStyles.input}
                                                    placeholder='les information de régime'
                                                    onChangeText={props.handleChange('element')}
                                                    value={props.values.element}
                                                    onBlur={props.handleBlur('element')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.element && props.errors.element }</Text>

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
                data={regms}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomReg.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('RegimesDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomReg}</Text>
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