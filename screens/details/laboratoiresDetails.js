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

export default function LaboratoiresDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nom } = route.params;
    const { adresse } = route.params;
    const { telephone } = route.params;
    const { email } = route.params;

    const editLaboratoires = (val) => {
        route.params.nom = val.nom;
        route.params.adresse = val.adresse;
        route.params.telephone = val.telephone;
        route.params.email = val.email;
        try {
            db.collection('laboratoires').doc(route.params.key).update({
                nom: val.nom,
                adresse: val.adresse,
                telephone: val.telephone,
                email: val.email,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Laboratoires',val)
        setModalOpen(false);
    }

    const laboratoireSchema = yup.object({
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
                                    initialValues={{ nom:route.params.nom , adresse:route.params.adresse, telephone:route.params.telephone+'', email:route.params.email}}
                                    validationSchema={laboratoireSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editLaboratoires(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder="saisie le nom de laboratoire"
                                                onChangeText={props.handleChange('nom')}
                                                value={props.values.nom}
                                                onBlur={props.handleBlur('nom')}
                                            />
                                            <Text style={globalStyles.errorText}>{ props.touched.nom && props.errors.nom }</Text>

                                            <TextInput
                                                style={globalStyles.input}
                                                placeholder="saisie l'adresse de laboratoire"
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
                                                placeholder="saisie l'email de laboratoire"
                                                onChangeText={props.handleChange('email')}
                                                value={props.values.email}
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

                <MaterialIcons name='settings' size={45} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>
                <TouchableOpacity onPress={ () => setModelOpen(true)} >
                    <Text style={styles.text}>Modifer la laboratoire</Text>
                </TouchableOpacity>

            <Card>
                <Text>{ nom }</Text>
                <Text>{ adresse }</Text>
                <Text>{ telephone }</Text>
                <Text>{ email }</Text>
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