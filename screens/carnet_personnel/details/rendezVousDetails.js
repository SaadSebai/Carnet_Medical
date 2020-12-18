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

export default function VaccinsDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomRnd } = route.params;
    const { time } = route.params;
    const { date } = route.params;
    const { doctor } = route.params;

    const editRV = (val) => {
        route.params.nomRnd = val.nomRnd;
        route.params.time = val.time;
        route.params.date = val.date;
        route.params.doctor = val.doctor;
        try {
            db.collection('rendezvous').doc(route.params.key).update({
                nomRnd: val.nomRnd,
                time: val.time,
                date: val.date,
                doctor: val.doctor,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('RendezVous',val)
        setModalOpen(false);
    }

    const rendezvousSchema = yup.object({
        nomRnd: yup.string().required().min(4).max(20),
        doctor: yup.string().required().min(4).max(60),
        time: yup.string().required(),
        date: yup.string().required(),
    })

    return(
        <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomRnd:route.params.nomRnd, doctor:route.params.doctor, time:route.params.time , date:route.params.date }}
                                    validationSchema={rendezvousSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editRV(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de rendez-vous'
                                                    onChangeText={props.handleChange('nomRnd')}
                                                    value={props.values.nomRnd}
                                                    onBlur={props.handleBlur('nomRnd')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomRnd && props.errors.nomRnd }</Text>

                                                <TextInput
                                                    miniHeight={60}
                                                    style={globalStyles.input}
                                                    placeholder='nom de docteur'
                                                    onChangeText={props.handleChange('doctor')}
                                                    value={props.values.doctor}
                                                    onBlur={props.handleBlur('doctor')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.doctor && props.errors.doctor }</Text>

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder={props.values.date}
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
                <Text>{ nomRnd }</Text>
                <Text>{ date }</Text>
                <Text>{ time }</Text>
                <Text>{ doctor }</Text>
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