import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../../styles/global';
import Card from '../../../Shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function OrdonnancesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomOrd } = route.params;
    const { doctor } = route.params;
    const { description } = route.params;

    const editOrd = (val) => {
        route.params.nomOrd = val.nomOrd;
        route.params.doctor = val.doctor;
        route.params.description = val.description;
        try {
            db.collection('ordonnances').doc(route.params.key).update({
                nomOrd: val.nomOrd,
                doctor: val.doctor,
                description: val.description,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Ordonnances',val)
        setModalOpen(false);
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
                                    <Formik
                                    initialValues={{ nomOrd:route.params.nomOrd, description:route.params.description, doctor:route.params.doctor }}
                                    validationSchema={ordonnanceSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editOrd(values);
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
                                                    multiline={true}
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
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='settings' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

            <Card>
                <Text>{ nomOrd }</Text>
                <Text>{ doctor }</Text>
                <Text>{ description }</Text>
            </Card>
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
})