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

export default function AllergiesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomAll } = route.params;
    const { cause } = route.params;
    const { description } = route.params;

    const editAll = (val) => {
        route.params.nomAll = val.nomAll;
        route.params.cause = val.cause;
        route.params.description = val.description;
        try {
            db.collection('allergies').doc(route.params.key).update({
                nomAll: val.nomAll,
                cause: val.cause,
                description: val.description,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Allergies',val)
        setModalOpen(false);
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
                                    <Formik
                                    initialValues={{ nomAll:route.params.nomAll, description:route.params.description, cause:route.params.cause }}
                                    validationSchema={allergieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editAll(values);
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
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='settings' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

            <Card>
                <Text>{ nomAll }</Text>
                <Text>{ cause }</Text>
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