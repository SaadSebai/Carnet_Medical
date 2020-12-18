import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Button, TouchableWithoutFeedback, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { globalStyles } from '../../styles/global';
import Card from '../../Shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function JoindreComptesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nom } = route.params;
    const { prenom } = route.params;
    const { age } = route.params;
    const { groupesanguin } = route.params;

    const editJoindreComptes = (val) => {
        route.params.nom = val.nom;
        route.params.prenom = val.prenom;
        route.params.age = val.age;
        route.params.groupesanguin = val.groupesanguin;
        try {
            db.collection('joindreComptes').doc(route.params.key).update({
                nom: val.nom,
                prenom: val.prenom,
                telephone: val.telephone,
                age: val.age,
                groupesanguin: val.groupesanguin,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('JoindreCompte',val)
        setModalOpen(false);
    }

    const joindreCompteSchema = yup.object({
        nom:yup.string().required().min(3),
        prenom:yup.string().required().min(3),
        age: yup.number().required().test('testgroupesanguin', 'the age should be between 0 and 200', (val) => {
            return val < 201 && val >= 0 ;
        }),
        groupesanguin :yup.string().required().min(5),
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
                                    initialValues={{ nom:route.params.nom , prenom:route.params.prenom, groupesanguin:route.params.groupesanguin, age:route.params.age+'' }}
                                    validationSchema={joindreCompteSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editJoindreComptes(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='saisie le nom'
                                                    onChangeText={props.handleChange('nom')}
                                                    value={props.values.nom}
                                                    onBlur={props.handleBlur('nom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nom && props.errors.nom }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='saisie le prenom'
                                                    onChangeText={props.handleChange('prenom')}
                                                    value={props.values.prenom}
                                                    onBlur={props.handleBlur('prenom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.prenom && props.errors.prenom }</Text>
                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder="saisie l'age"
                                                    onChangeText={props.handleChange('age')}
                                                    value={props.values.age}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('age')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.rating && props.errors.rating }</Text>
                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='saisie le groupe sanguin'
                                                    onChangeText={props.handleChange('groupesanguin')}
                                                    value={props.values.groupesanguin}
                                                    onBlur={props.handleBlur('groupesanguin')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.groupesanguin && props.errors.groupesanguin }</Text>

                                                <Button title='submit' color='maroon' onPress={props.handleSubmit} />
                                            </View>
                                        )}
                                    </Formik>
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='settings' size={45} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>
                <TouchableOpacity onPress={ () => setmodelOpen(true)} >
                    <Text style={styles.text}>Modifer le compte</Text>
                </TouchableOpacity>

            <Card>
                <Text>{ nom }</Text>
                <Text>{ prenom }</Text>
                <Text>{ age }</Text>
                <Text>{ groupesanguin }</Text>
            </Card>
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
    text:{
        textAlign:'center',
        color:"#333",
        fontSize:20,
        marginBottom:10,
    },
})