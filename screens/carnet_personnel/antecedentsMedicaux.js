import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function AntecedentsMedicaux({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [aMeds, setAMeds] = useState([]);
    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [aMeds,route]);

    const addAMeds = async (aMeds) => {
        aMeds.key = Math.random().toString();
        aMeds.userKey = global.userKey;
        setAMeds((currentaMeds) => {
            return [aMeds, ...currentaMeds];
        });
        try {
            db.collection('aMeds').doc(aMeds.key).set({
                key: aMeds.key,
                userKey: aMeds.userKey,
                nomAM: aMeds.nomAM,
                description: aMeds.description,
                datedebut: aMeds.datedebut,
                datefin: aMeds.datefin
            });   
        } catch (error) {
            console.log('firebase error');
        }
        setModalOpen(false);
    }

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'aMeds',
              JSON.stringify(aMeds)
            );
            console.log(aMeds);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('aMeds');
            if (value !== null) {
                console.log('returned');
                setAMeds(JSON.parse(value));
            }
            
        } catch (error) {
            console.log('no value');
        }
    };

    const supprimerAlert = (key) => {
        Alert.alert('supprimer','êtes-vous sûr de vouloir supprimer ce contenu?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (supprimer(key))}
        ]);
    }

    const supprimer = (key) => {
        console.log(key);
        setAMeds((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('aMeds').doc(key).delete();
    }

    const AMedSchema = yup.object({
        nomAM: yup.string().required().min(3).max(20),
        description: yup.string().required().min(10).max(300),
        datedebut: yup.string().required(),
        datefin: yup.string().required(),
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
                                    initialValues={{ nomAM:'', description:'', datedebut:'', datefin:'' }}
                                    validationSchema={AMedSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addAMeds(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='titre'
                                                    onChangeText={props.handleChange('nomAM')}
                                                    value={props.values.nomAM}
                                                    onBlur={props.handleBlur('nomAM')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomAM && props.errors.nomAM }</Text>

                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    miniHeight={60}
                                                    style={globalStyles.input}
                                                    placeholder='description'
                                                    onChangeText={props.handleChange('description')}
                                                    value={props.values.description}
                                                    onBlur={props.handleBlur('description')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.description && props.errors.description }</Text>

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder="select date debut"
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
                                                    onDateChange={props.handleChange('datedebut')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.datedebut && props.errors.datedebut }</Text>

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder="select date final"
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
                                                    onDateChange={props.handleChange('datefin')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.datefin && props.errors.datefin }</Text>

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
                data={aMeds}
                renderItem={({ item }) =>{
                    if(item.userKey == global.userKey)
                    if(item.nomAM.startsWith(text)){
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('AntMedDetails', item)}>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomAM}</Text>
                            </Card>
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
    mod:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    first:{
        borderWidth: 1,
        width: 42,
        height: '70%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 40,
        backgroundColor: 'blue',
    }
});