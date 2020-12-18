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

export default function ChirurgiesDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const { key } = route.params;
    const { nomCh } = route.params;
    const { date } = route.params;
    const { hopital } = route.params;

    const editChg = (val) => {
        route.params.nomCh = val.nomCh;
        route.params.date = val.date;
        route.params.hopital = val.hopital;
        try {
            db.collection('chirurgies').doc(route.params.key).update({
                nomCh: val.nomCh,
                date: val.date,
                hopital: val.hopital,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Chirurgies',val)
        setModalOpen(false);
    }

    const chirurgieSchema = yup.object({
        nomCh: yup.string().required().min(4).max(20),
        hopital: yup.string().required().min(4).max(30),
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
                                    initialValues={{ nomCh:route.params.nomCh, date:route.params.date, hopital:route.params.hopital }}
                                    validationSchema={chirurgieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editChg(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de chirurgie'
                                                    onChangeText={props.handleChange('nomCh')}
                                                    value={props.values.nomCh}
                                                    onBlur={props.handleBlur('nomCh')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomCh && props.errors.nomCh }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='hopital'
                                                    onChangeText={props.handleChange('hopital')}
                                                    value={props.values.hopital}
                                                    onBlur={props.handleBlur('hopital')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.hopital && props.errors.hopital }</Text>


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
                <Text>{ nomCh }</Text>
                <Text>{ date }</Text>
                <Text>{ hopital }</Text>
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