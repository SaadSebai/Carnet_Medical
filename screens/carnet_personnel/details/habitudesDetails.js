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

export default function HabitudesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    
    const { key } = route.params;
    const { nomHb } = route.params;
    const { datedebut } = route.params;
    const { datefin } = route.params;

    const editHB = (val) => {
        route.params.nomHb = val.nomHb;
        route.params.datedebut = val.datedebut;
        route.params.datefin = val.datefin;
        try {
            db.collection('habitudes').doc(route.params.key).update({
                nomHb: val.nomHb,
                datedebut: val.datedebut,
                datefin: val.datefin,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Habitudes',val)
        setModalOpen(false);
    }

    const habitudeSchema = yup.object({
        nomHb: yup.string().required().min(2).max(60),
        datedebut: yup.string().required(),
        datefin: yup.string().required(),
    })

    return(
        <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomHb:route.params.nomHb, datedebut:route.params.datedebut, datefin:route.params.datefin }}
                                    validationSchema={habitudeSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editHB(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='habitude'
                                                    onChangeText={props.handleChange('nomHb')}
                                                    value={props.values.nomHb}
                                                    onBlur={props.handleBlur('nomHb')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomHb && props.errors.nomHb }</Text>

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder={props.values.datedebut}
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
                                                    onDateChange={props.handleChange('datedebut')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.datedebut && props.errors.datedebut }</Text>

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder={props.values.datefin}
                                                    format="YYYY-MM-DD"
                                                    
                                                    maxDate="2020-05-01"
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
                                                    onDateChange={props.handleChange('datefin')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.datefin && props.errors.datefin }</Text>
                                                
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
                <Text>{ nomHb }</Text>
                <Text>{ datedebut }</Text>
                <Text>{ datefin }</Text>
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