import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Alert, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function Allergies({navigation, route}){

    
    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [allergies, setAllergies] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [allergies,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'allergies',
              JSON.stringify(allergies)
            );
            console.log(allergies);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('allergies');
            if (value !== null) {
                
                console.log('returned');
                setAllergies(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
            
        }
    };

    const addAllergies = (allergies) => {
        allergies.key = Math.random().toString();
        allergies.userKey = global.userKey;
        setAllergies((currentallergies) => {
            return [allergies, ...currentallergies];
        });
        try {
            db.collection('allergies').doc(allergies.key).set({
                key: allergies.key,
                userKey: allergies.userKey,
                nomAll: allergies.nomAll,
                cause: allergies.cause,
                description: allergies.description
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
        setAllergies((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('allergies').doc(key).delete();
    }

    const allergieSchema = yup.object({
        nomAll: yup.string().required().min(4).max(60),
        cause: yup.string().required().min(4).max(60),
        description: yup.string().required().min(10).max(300),
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
                                    initialValues={{ nomAll:'', description:'', cause:'' }}
                                    validationSchema={allergieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addAllergies(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="nom d'allergie"
                                                    onChangeText={props.handleChange('nomAll')}
                                                    value={props.values.nomAll}
                                                    onBlur={props.handleBlur('nomAll')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomAll && props.errors.nomAll }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='la cause'
                                                    onChangeText={props.handleChange('cause')}
                                                    value={props.values.cause}
                                                    onBlur={props.handleBlur('cause')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomAll && props.errors.nomAll }</Text>

                                                <TextInput
                                                    numberOfLines={4}
                                                    multiline
                                                    miniHeight={60}
                                                    style={globalStyles.input}
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
                data={allergies}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomAll.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('AllergiesDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomAll}</Text>
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