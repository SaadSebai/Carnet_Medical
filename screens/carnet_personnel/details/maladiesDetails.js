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

export default function MaladiesDetails({route, navigation}){

    var db = firebase.firestore();

    const { key } = route.params;
    const { nomMaladie } = route.params;
    const { date } = route.params;
    const { description } = route.params;

    
    const [modalOpen, setModalOpen] = useState(false);
    
    const editMaladies = (val) => {
        route.params.nomMaladie = val.nomMaladie;
        route.params.date = val.date;
        route.params.description = val.description;
        try {
            db.collection('maladies').doc(route.params.key).update({
                nomMaladie: val.nomMaladie,
                date: val.date,
                description: val.description,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Maladies',val)
        setModalOpen(false);
    }

    const maladieSchema = yup.object({
        nomMaladie: yup.string().required().min(4).max(20),
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
                                    initialValues={{ nomMaladie: route.params.nomMaladie, description: route.params.description, date:route.params.date }}
                                    validationSchema={maladieSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editMaladies(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de maladie'
                                                    onChangeText={props.handleChange('nomMaladie')}
                                                    value={props.values.nomMaladie}
                                                    onBlur={props.handleBlur('nomMaladie')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomMaladie && props.errors.nomMaladie }</Text>

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
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    value={props.values.description}
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
                <Text>{ nomMaladie }</Text>
                <Text>{ date }</Text>
                <Text>{ description }</Text>
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
