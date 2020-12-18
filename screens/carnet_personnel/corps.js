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

export default function Corps({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [corps, setCorps] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [corps,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'corps',
              JSON.stringify(corps)
            );
            console.log(corps);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('corps');
            if (value !== null) {
                console.log('returned');
                setCorps(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addCorps = (corps) => {
        corps.key = Math.random().toString();
        corps.userKey = global.userKey;
        setCorps((currentcorps) => {
            return [corps, ...currentcorps];
        });
        try {
            db.collection('corps').doc(corps.key).set({
                key: corps.key,
                userKey: corps.userKey,
                nomCrp: corps.nomCrp,
                poid: corps.poid,
                mesure: corps.mesure
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
        setCorps((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('corps').doc(key).delete();
    }

    const corpSchema = yup.object({
        nomCrp: yup.string().required().min(3).max(60),
        poid: yup.number().required().test('testMesure', 'the numbre should be between 1kg and 500kg', (val) => {
            return val < 501 && val > 0 ;
        }),
        mesure: yup.number().required().test('testMesure', 'the numbre should be between 1kg and 500kg', (val) => {
            return val < 501 && val > 0 ;
        })
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
                                    initialValues={{ nomCrp:'', poid:'', mesure:'' }}
                                    validationSchema={corpSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addCorps(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de examen'
                                                    onChangeText={props.handleChange('nomCrp')}
                                                    value={props.values.nomCrp}
                                                    onBlur={props.handleBlur('nomCrp')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomCrp && props.errors.nomCrp }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='poid'
                                                    onChangeText={props.handleChange('poid')}
                                                    value={props.values.poid}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('poid')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.poid && props.errors.poid }</Text>
                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='mesure'
                                                    onChangeText={props.handleChange('mesure')}
                                                    value={props.values.mesure}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('mesure')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.mesure && props.errors.mesure }</Text>

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
                data={corps}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomCrp.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('CorpsDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomCrp}</Text>
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