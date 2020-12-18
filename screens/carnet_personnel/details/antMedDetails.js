import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../../styles/global';
import Card from '../../../Shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function AntMedDetails({route, navigation}){

    var db = firebase.firestore();

    const { key } = route.params;
    const { nomAM } = route.params;
    const { datedebut } = route.params;
    const { datefin } = route.params;
    const { description } = route.params;

    const [modalOpen, setModalOpen] = useState(false);

    const editAMeds = (val) => {
        route.params.nomAM = val.nomAM;
        route.params.datedebut = val.datedebut;
        route.params.datefin = val.datefin;
        route.params.description = val.description;
        try {
            db.collection('aMeds').doc(route.params.key).update({
                nomAM: val.nomAM,
                datedebut: val.datedebut,
                datefin: val.datefin,
                description: val.description,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('AntecedentsMedicaux',val)
        setModalOpen(false);
    }

    const AMedSchema = yup.object({
        nomAM: yup.string().required().min(4).max(20),
        description: yup.string().required().min(10).max(200),
    })

    return(
        
        <View style={ globalStyles.container }>


        <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomAM: route.params.nomAM, description:route.params.description, datedebut:route.params.datedebut, datefin:route.params.datefin }}
                                    validationSchema={AMedSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editAMeds(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='titre'
                                                    onChangeText={props.handleChange('nomAM')}
                                                    value={props.values.nomAM}
                                                    onBlur={props.handleBlur('nomAM')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomAM && props.errors.nomAM }</Text>

                                                <TextInput
                                                    multiline={true}
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
                                                    mode="date"
                                                    placeholder="select date debut"
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
                                                    onDateChange={props.handleChange('datedebut')}
                                                />

                                                <DatePicker
                                                    style={{width: 200, marginBottom: 20}}
                                                    mode="date"
                                                    placeholder="select date final"
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
                <Text style={globalStyles.titleText}>{ nomAM }</Text>
                <Text style={globalStyles.titleText}>{ datedebut }</Text>
                <Text style={globalStyles.titleText}>{ datefin }</Text>
                <Text style={globalStyles.titleText}>{ description }</Text>
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
