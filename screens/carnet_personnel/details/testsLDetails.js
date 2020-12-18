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

export default function TestsLDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    
    const { key } = route.params;
    const { nomTest } = route.params;
    const { date } = route.params;
    const { time } = route.params;
    const { resultat } = route.params;

    const editTestL = (val) => {
        route.params.nomTest = val.nomTest;
        route.params.date = val.date;
        route.params.time = val.time;
        route.params.resultat = val.resultat;
        try {
            db.collection('testL').doc(route.params.key).update({
                nomTest: val.nomTest,
                date: val.date,
                time: val.time,
                resultat: val.resultat,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('TestsL',val);
        setModalOpen(false);
    }

    const testLSchema = yup.object({
        nomTest: yup.string().required().min(4).max(20),
        resultat: yup.string().required().min(4).max(300),
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
                                    initialValues={{ nomTest:route.params.nomTest, date:route.params.date, time:route.params.time , resultat:route.params.resultat }}
                                    validationSchema={testLSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editTestL(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de chirurgie'
                                                    onChangeText={props.handleChange('nomTest')}
                                                    value={props.values.nomTest}
                                                    onBlur={props.handleBlur('nomTest')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomTest && props.errors.nomTest }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    placeholder='resultat'
                                                    onChangeText={props.handleChange('resultat')}
                                                    value={props.values.resultat}
                                                    onBlur={props.handleBlur('resultat')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.resultat && props.errors.resultat }</Text>


                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder="select date"
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
                <Text>{ nomTest }</Text>
                <Text>{ date }</Text>
                <Text>{ time }</Text>
                <Text>{ resultat }</Text>
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