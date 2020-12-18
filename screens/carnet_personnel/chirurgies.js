import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }


export default function Chirurgies({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [chirurgies, setChirurgies] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [chirurgies,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'chirurgies',
              JSON.stringify(chirurgies)
            );
            console.log(chirurgies);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('chirurgies');
            if (value !== null) {
                console.log('returned');
                setChirurgies(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addChirurgies = (chirurgies) => {
        chirurgies.key = Math.random().toString();
        chirurgies.userKey = global.userKey;
        setChirurgies((currentchirurgies) => {
            return [chirurgies, ...currentchirurgies];
        });
        try {
            db.collection('chirurgies').doc(chirurgies.key).set({
                key: chirurgies.key,
                userKey: chirurgies.userKey,
                nomCh: chirurgies.nomCh,
                hopital: chirurgies.hopital,
                date: chirurgies.date
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
        setChirurgies((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('chirurgies').doc(key).delete();
    }

    const chirurgieSchema = yup.object({
        nomCh: yup.string().required().min(4).max(20),
        hopital: yup.string().required().min(4).max(30),
        date: yup.string().required(),
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
                                    initialValues={{ nomCh:'', date:'', hopital:'' }}
                                    validationSchema={chirurgieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addChirurgies(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de chirurgie'
                                                    onChangeText={props.handleChange('nomCh')}
                                                    value={props.values.nomCh}
                                                    onBlur={props.handleBlur('nomCh')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomCh && props.errors.nomCh }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='hopital'
                                                    onChangeText={props.handleChange('hopital')}
                                                    value={props.values.hopital}
                                                    onBlur={props.handleBlur('hopital')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.hopital && props.errors.hopital }</Text>


                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                    dateIcon: {
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0
                                                    },
                                                    dateInput: {
                                                        marginLeft: 36
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={props.handleChange('date')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.date && props.errors.date }</Text>
                                                
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
                data={chirurgies}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomCh.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('ChirurgiesDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomCh}</Text>
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