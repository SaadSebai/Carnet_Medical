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

export default function AntecedentsFamiliauxDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomMF } = route.params;
    const { rolation } = route.params;
    const { nomMl } = route.params;

    const editAF = (val) => {
        route.params.nomMF = val.nomMF;
        route.params.rolation = val.rolation;
        route.params.nomMl = val.nomMl;
        try {
            db.collection('anFams').doc(route.params.key).update({
                nomMF: val.nomMF,
                rolation: val.rolation,
                nomMl: val.nomMl,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('AntecedentsFamiliaux',val)
        setModalOpen(false);
    }

    const anFamSchema = yup.object({
        nomMF: yup.string().required().min(2).max(60),
        rolation: yup.string().required().min(2).max(60),
        nomMl: yup.string().required().min(2).max(60),
    })

    return(
        <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomMF:route.params.nomMF, rolation:route.params.rolation, nomMl:route.params.nomMl }}
                                    validationSchema={anFamSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editAF(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de membre de famille'
                                                    onChangeText={props.handleChange('nomMF')}
                                                    value={props.values.nomMF}
                                                    onBlur={props.handleBlur('nomMF')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMF && props.errors.nomMF }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='votre relations entre ce membre'
                                                    onChangeText={props.handleChange('rolation')}
                                                    value={props.values.rolation}
                                                    onBlur={props.handleBlur('rolation')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.rolation && props.errors.rolation }</Text>


                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de maladie'
                                                    onChangeText={props.handleChange('nomMl')}
                                                    value={props.values.nomMl}
                                                    onBlur={props.handleBlur('nomMl')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMl && props.errors.nomMl }</Text>
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
                <Text>{ nomMF }</Text>
                <Text>{ rolation }</Text>
                <Text>{ nomMl }</Text>
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