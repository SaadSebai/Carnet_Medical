import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, TouchableOpacity, Alert, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

export default function Maladies({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [maladies, setMaladies] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
    }, [maladies,route]);

    const [text, setText] = useState('');

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'maladies',
              JSON.stringify(maladies)
            );
            console.log(maladies);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('maladies');
            if (value !== null) {
                console.log('returned');
                setMaladies(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addMaladies = (maladies) => {
        maladies.key = Math.random().toString();
        maladies.userKey = global.userKey;
        setMaladies((currentMaladies) => {
            return [maladies, ...currentMaladies];
        });
        try {
            db.collection('maladies').doc(maladies.key).set({
                key: maladies.key,
                userKey: maladies.userKey,
                nomMaladie: maladies.nomMaladie,
                description: maladies.description,
                date: maladies.date
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
        setMaladies((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('maladies').doc(key).delete();
    }

    const maladieSchema = yup.object({
        nomMaladie: yup.string().required().min(4).max(20),
        description: yup.string().required().min(10).max(200),
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
                                    initialValues={{ nomMaladie:'', description:'', date:'' }}
                                    validationSchema={maladieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addMaladies(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de maladie'
                                                    onChangeText={props.handleChange('nomMaladie')}
                                                    value={props.values.nomMaladie}
                                                    onBlur={props.handleBlur('nomMaladie')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMaladie && props.errors.nomMaladie }</Text>

                                                <TextInput
                                                    multiline
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
                data={maladies}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomMaladie.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('MaladiesDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomMaladie}</Text>
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