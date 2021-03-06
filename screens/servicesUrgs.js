import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TextInput, FlatList, Alert, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function ServicesUrgs({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [servicesUrgs, setServicesUrgs] = useState([]);

    const [text, setText] = useState('');

    const [coleur, setColeur] = useState('black');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );

    useEffect(() => {
        setColeur('');
    }, [coleur]);

    useEffect(() => {
        _storeData();
    }, [servicesUrgs,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'servicesUrgs',
              JSON.stringify(servicesUrgs)
            );
            console.log(servicesUrgs);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('servicesUrgs');
            if (value !== null) {
                console.log('returned');
                setServicesUrgs(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const addServicesUrgs = (servicesUrgs) => {
        servicesUrgs.key = Math.random().toString();
        servicesUrgs.favori = 0;
        servicesUrgs.userKey = global.userKey;
        setServicesUrgs((currentservicesUrgs) => {
            return [servicesUrgs, ...currentservicesUrgs];
        });
        try {
            db.collection('servicesUrgs').doc(servicesUrgs.key).set({
                key: servicesUrgs.key,
                userKey: servicesUrgs.userKey,
                favori: servicesUrgs.favori,
                nom: servicesUrgs.nom,
                adresse: servicesUrgs.adresse,
                telephone: servicesUrgs.telephone,
                email: servicesUrgs.email
            });   
        } catch (error) {
            console.log('firebase error');
        }
        setModalOpen(false);
    }
    const updatefavori = (v) => {
        db.collection('servicesUrgs').doc(v.key).update({
            favori: v.favori
        })
    }

    const supprimerAlert = (key) => {
        Alert.alert('supprimer','êtes-vous sûr de vouloir supprimer ce contenu?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (supprimer(key))}
        ]);
    }

    const supprimer = (key) => {
        console.log(key);
        setServicesUrgs((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('servicesUrgs').doc(key).delete();
    }

    const servicesUrgSchema = yup.object({
        nom: yup.string().required().min(3),
        adresse: yup.string().required().min(3),
        telephone: yup.number().required().max(9999999999),
        email: yup.string().email().required(),
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
                                    initialValues={{ nom:'', adresse:'', telephone:'', email:'' }}
                                    validationSchema={servicesUrgSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addServicesUrgs(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie le nom de services d'urgence"
                                                    onChangeText={props.handleChange('nom')}
                                                    value={props.values.nom}
                                                    onBlur={props.handleBlur('nom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nom && props.errors.nom }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie l'adresse de services d'urgence"
                                                    onChangeText={props.handleChange('adresse')}
                                                    value={props.values.adresse}
                                                    onBlur={props.handleBlur('adresse')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.adresse && props.errors.adresse }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie la numero de telephone"
                                                    onChangeText={props.handleChange('telephone')}
                                                    value={props.values.telephone}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('telephone')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.telephone && props.errors.telephone }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie l'email de services d'urgence"
                                                    onChangeText={props.handleChange('email')}
                                                    value={props.values.email}
                                                    keyboardType='email-address'
                                                    onBlur={props.handleBlur('email')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.email && props.errors.email }</Text>

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
                <TouchableOpacity onPress={ () => setModelOpen(true)} >
                    <Text style={styles.text}>Ajouter une service d'urgence</Text>
                </TouchableOpacity>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={servicesUrgs}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nom.startsWith(text))
                    return(
                    <View style={styles.non}>

                        
                        <TouchableOpacity onPress={() => navigation.navigate('ServicesUrgsDetails', item) }>
                            <Card>
                                <Text style={styles.styletext}>{item.nom}</Text>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if(item.favori==0){
                                item.favori=1;
                                updatefavori(item);
                                _storeData();
                                setColeur('red');
                            }else{
                                item.favori=0;
                                updatefavori(item);
                                _storeData();
                                setColeur('black');
                            }
                        }}>
                            <Image style={globalStyles.like} source={images.likes[item.favori]} />
                        </TouchableOpacity><Ionicons name='ios-trash' size={55} style={styles.supp} onPress={() => supprimerAlert(item.key)}/>
                        
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
        width:190,
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