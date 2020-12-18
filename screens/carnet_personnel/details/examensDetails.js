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

export default function ExamensDetails({route, navigation}){

    var db = firebase.firestore();

    const { key } = route.params;
    const { nomExm } = route.params;
    const { time } = route.params;
    const { date } = route.params;
    const { hopitalNom } = route.params;

    const [modalOpen, setModalOpen] = useState(false);

    const editExm = (val) => {
        route.params.nomExm = val.nomExm;
        route.params.date = val.date;
        route.params.time = val.time;
        route.params.hopitalNom = val.hopitalNom;
        try {
            db.collection('examens').doc(route.params.key).update({
                nomExm: val.nomExm,
                date: val.date,
                time: val.time,
                hopitalNom: val.hopitalNom,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Examens',val)
        setModalOpen(false);
    }

    const ExamenSchema = yup.object({
        nomExm: yup.string().required().min(4),
        hopitalNom: yup.string().required().min(4).max(60),
        date: yup.string().required(),
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
                                    initialValues={{ nomExm:route.params.nomExm, hopitalNom:route.params.hopitalNom, date:route.params.date, time:route.params.time }}
                                    validationSchema={ExamenSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editExm(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de examen'
                                                    onChangeText={props.handleChange('nomExm')}
                                                    value={props.values.nomExm}
                                                    onBlur={props.handleBlur('nomExm')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomExm && props.errors.nomExm }</Text>

                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de hopital'
                                                    onChangeText={props.handleChange('hopitalNom')}
                                                    value={props.values.hopitalNom}
                                                    onBlur={props.handleBlur('hopitalNom')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.hopitalNom && props.errors.hopitalNom }</Text>
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
                <Text>{ nomExm }</Text>
                <Text>{ date }</Text>
                <Text>{ time }</Text>
                <Text>{ hopitalNom }</Text>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create ({
    rating: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
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
