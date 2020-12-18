import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function Ordonnances({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [ordonnances, setOrdonnances] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [ordonnances,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'ordonnances',
              JSON.stringify(ordonnances)
            );
            console.log(ordonnances);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('ordonnances');
            if (value !== null) {
                console.log('returned');
                setOrdonnances(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addOrdonnances = (ordonnances) => {
        ordonnances.key = Math.random().toString();
        ordonnances.userKey = global.userKey;
        setOrdonnances((currentordonnances) => {
            return [ordonnances, ...currentordonnances];
        });
        try {
            db.collection('ordonnances').doc(ordonnances.key).set({
                key: ordonnances.key,
                userKey: ordonnances.userKey,
                nomOrd: ordonnances.nomOrd,
                doctor: ordonnances.doctor,
                description: ordonnances.description
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
        setOrdonnances((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('ordonnances').doc(key).delete();
    }

    const ordonnanceSchema = yup.object({
        nomOrd: yup.string().required().min(4).max(20),
        doctor: yup.string().required().min(4).max(30),
        description: yup.string().required().min(4).max(300),
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
                                    initialValues={{ nomOrd:'', description:'', doctor:'' }}
                                    validationSchema={ordonnanceSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addOrdonnances(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de chirurgie'
                                                    onChangeText={props.handleChange('nomOrd')}
                                                    value={props.values.nomOrd}
                                                    onBlur={props.handleBlur('nomOrd')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomOrd && props.errors.nomOrd }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='doctor'
                                                    onChangeText={props.handleChange('doctor')}
                                                    value={props.values.doctor}
                                                    onBlur={props.handleBlur('doctor')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.doctor && props.errors.doctor }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    numberOfLines={4}
                                                    miniHeight={60}
                                                    placeholder='description'
                                                    onChangeText={props.handleChange('description')}
                                                    value={props.values.description}
                                                    onBlur={props.handleBlur('description')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.description && props.errors.description }</Text>
                                                
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
                data={ordonnances}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomOrd.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('OrdonnancesDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomOrd}</Text>
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