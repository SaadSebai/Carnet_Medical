import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Button, TouchableWithoutFeedback, Keyboard, AsyncStorage, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
import { useFocusEffect } from '@react-navigation/native';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }


export default function UserSignup({navigation}){

    var db = firebase.firestore();

    const [user, setUser] = useState([]);
    const [users, setUsers] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            firebaseData();
        },[])
    );

    const UserSchema = yup.object({
        nom: yup.string().required().min(2).max(20),
        prenom: yup.string().required().min(2).max(20),
        email: yup.string().email().required(),
        telephone: yup.number().required().max(9999999999),
        genre : yup.string().required(),
        age: yup.number().required().min(0).max(500),
        password: yup.string().required().min(3).max(20),
        passwordConf: yup.string().required().min(3).max(20),
    })

    const firebaseData = () => {
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var users = doc.data();
                setUser((currentusers) => {
                    return [users, ...currentusers];
                });
            })
            console.log(users)
        })
    }

    const SignUp = (u) => {
        u.key = Math.random().toString();
        var test = 0;
        user.forEach((element) => {
            if(element.email == u.email){
                test = 1;
                console.log('found');
            }
        })
        if(test == 1){
            Alert.alert('Email Erreur',"L'email est déja existe",[
                {text: 'ok'}
            ]);
        }else{
            try {
                db.collection('users').add({
                    key: u.key,
                    nom: u.nom,
                    prenom: u.prenom,
                    email: u.email,
                    telephone: u.telephone,
                    genre: u.genre,
                    age: u.age,
                    password: u.password,
                });
            } catch (error) {
                console.log('firebase error');
            }
            navigation.navigate('UserLogin');
        }
        
    }

        return(
            <View style={ globalStyles.container }>
                
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <View style={globalStyles.container}>
                                <Formik
                                initialValues={{ nom:'', prenom:'', email:'', telephone:'', genre:'', age:'', password:''}}
                                validationSchema={UserSchema}
                                onSubmit={(values,actions) => {
                                    actions.resetForm();
                                    SignUp(values);
                                }}
                                >
                                    {(props) => (
                                        <View>
                                            <Text>Nom d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder='Nom'
                                                onChangeText={props.handleChange('nom')}
                                                value={props.values.nom}
                                                onBlur={props.handleBlur('nom')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.nom && props.errors.nom }</Text>

                                            <Text>Prénom d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder='Prénom'
                                                onChangeText={props.handleChange('prenom')}
                                                value={props.values.prenom}
                                                onBlur={props.handleBlur('prenom')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.prenom && props.errors.prenom }</Text>

                                            <Text>Email d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder='Email'
                                                onChangeText={props.handleChange('email')}
                                                value={props.values.email}
                                                keyboardType='email-address'
                                                onBlur={props.handleBlur('email')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.email && props.errors.email }</Text>

                                            <Text>telephone d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder="Numero de telephone"
                                                onChangeText={props.handleChange('telephone')}
                                                value={props.values.telephone}
                                                keyboardType='numeric'
                                                onBlur={props.handleBlur('telephone')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.telephone && props.errors.telephone }</Text>

                                            <Text>L'age d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder="Age"
                                                onChangeText={props.handleChange('age')}
                                                value={props.values.age}
                                                keyboardType='numeric'
                                                onBlur={props.handleBlur('age')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.age && props.errors.age }</Text>

                                            <Text>Genre d'utilisateur :</Text>

                                            <View style={ styles.picker }>
                                                <RNPickerSelect
                                                    style={{ ...pickerSelectStyles }}
                                                    placeholder={{
                                                        label: 'Genre',
                                                        value: null,
                                                    }}
                                                    onValueChange={(v) => {props.values.genre = v}}
                                                    items={[
                                                        { label: 'Mâle', value: 'mâle' },
                                                        { label: 'Femelle', value: 'femelle' },
                                                        { label: 'Autre', value: 'autre' },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={globalStyles.errorText}>{ props.touched.genre && props.errors.genre }</Text>
                                            {/* <Text style={globalStyles.errorText}>{ props.touched.age && props.errors.age }</Text>
                                            <Text>Genre d'utilisateur :</Text>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder='Genre'
                                                onChangeText={props.handleChange('genre')}
                                                value={props.values.genre}
                                                onBlur={props.handleBlur('genre')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.genre && props.errors.genre }</Text> */}

                                            <Text>Mote de passe :</Text>
                                            <TextInput
                                                miniHeight={60}
                                                style={globalStyles.input}
                                                placeholder='User password'
                                                onChangeText={props.handleChange('password')}
                                                value={props.values.password}
                                                onBlur={props.handleBlur('password')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.password && props.errors.password }</Text>

                                            <Text>Confirmer votre mot de passe :</Text>
                                            <TextInput
                                                miniHeight={60}
                                                style={globalStyles.input}
                                                placeholder='User password'
                                                onChangeText={props.handleChange('passwordConf')}
                                                value={props.values.passwordConf}
                                                onBlur={props.handleBlur('passwordConf')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.passwordConf && props.errors.passwordConf }</Text>

                                            <Button title='Sign Up' color='#3f3f44' onPress={props.handleSubmit} />
                                        </View>
                                    )}
                                </Formik>
                                <Text style={{color: '#0390fc', marginTop: 30,alignSelf: 'center',}}
                                    onPress={() => navigation.navigate('UserLogin')}>
                                Log-In!
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
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
    picker: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

const pickerSelectStyles = StyleSheet.create({

    inputIOS: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 19,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        color: 'black',
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 19,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        color: 'black',
    },

});