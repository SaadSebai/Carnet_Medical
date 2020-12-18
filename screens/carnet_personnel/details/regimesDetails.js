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

export default function RegimesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomReg } = route.params;
    const { element } = route.params;

    const editRegm = (val) => {
        route.params.nomReg = val.nomReg;
        route.params.element = val.element;
        try {
            db.collection('regms').doc(route.params.key).update({
                nomReg: val.nomReg,
                element: val.element,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Regimes',val)
        setModalOpen(false);
    }

    const regmSchema = yup.object({
        nomReg: yup.string().required().min(2).max(60),
        element: yup.string().required().min(10).max(300),
    })

    return(
        <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomReg:route.params.nomReg, element:route.params.element }}
                                    validationSchema={regmSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editRegm(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de régime'
                                                    onChangeText={props.handleChange('nomReg')}
                                                    value={props.values.nomReg}
                                                    onBlur={props.handleBlur('nomReg')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomReg && props.errors.nomReg }</Text>

                                                <TextInput
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    style={globalStyles.input}
                                                    placeholder='les information de régime'
                                                    onChangeText={props.handleChange('element')}
                                                    value={props.values.element}
                                                    onBlur={props.handleBlur('element')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.element && props.errors.element }</Text>

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
                <Text>{ nomReg }</Text>
                <Text>{ element }</Text>
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