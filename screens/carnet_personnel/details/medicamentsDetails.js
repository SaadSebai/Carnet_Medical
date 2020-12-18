import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../../styles/global';
import Card from '../../../Shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function MedicamentsDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomMed } = route.params;
    const { time } = route.params;
    const { description } = route.params;

    const editMedD = (val) => {
        route.params.nomMed = val.nomMed;
        route.params.time = val.time;
        route.params.description = val.description;
        try {
            db.collection('medicaments').doc(route.params.key).update({
                nomMed: val.nomMed,
                time: val.time,
                description: val.description,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Medicaments',val)
        setModalOpen(false);
    }

    const medicamentSchema = yup.object({
        nomMed: yup.string().required().min(4).max(60),
        description: yup.string().required().min(4).max(300),
        time: yup.string().required(),
    })

    return(
        <View style={ globalStyles.container }>

                <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomMed:route.params.nomMed, description:route.params.description, time:route.params.time }}
                                    validationSchema={medicamentSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editMedD(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de medicatent'
                                                    onChangeText={props.handleChange('nomMed')}
                                                    value={props.values.nomMed}
                                                    onBlur={props.handleBlur('nomMed')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMed && props.errors.nomMed }</Text>

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
                                                    mode="time"
                                                    placeholder={props.values.time}
                                                    format="HH:mm"
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
                                                    onDateChange={props.handleChange('time')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.time && props.errors.time }</Text>
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
                <Text>{ nomMed }</Text>
                <Text>{ time }</Text>
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