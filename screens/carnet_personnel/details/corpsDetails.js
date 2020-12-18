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

export default function CorpsDetails({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);

    const { key } = route.params;
    const { nomCrp } = route.params;
    const { poid } = route.params;
    const { mesure } = route.params;

    const editCorp = (val) => {
        route.params.nomCrp = val.nomCrp;
        route.params.poid = val.poid;
        route.params.mesure = val.mesure;
        try {
            db.collection('corps').doc(route.params.key).update({
                nomCrp: val.nomCrp,
                poid: val.poid,
                mesure: val.mesure,
            })
            console.log('updated');
        } catch (error) {
            console.log('catch')
        }
        navigation.navigate('Corps',val)
        setModalOpen(false);
    }

    const corpSchema = yup.object({
        nomCrp: yup.string().required().min(2).max(60),
        poid: yup.number().required().test('testMesure', 'the numbre should be between 1kg and 200kg', (val) => {
            return val < 201 && val > 0 ;
        }),
        mesure: yup.number().required().test('testMesure', 'the numbre should be between 1kg and 200kg', (val) => {
            return val < 201 && val > 0 ;
        })
    })

    return(
        <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                    <Formik
                                    initialValues={{ nomCrp:route.params.nomCrp, mesure:route.params.mesure+'', poid:route.params.poid+'' }}
                                    validationSchema={corpSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        editCorp(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de examen'
                                                    onChangeText={props.handleChange('nomCrp')}
                                                    value={props.values.nomCrp}
                                                    onBlur={props.handleBlur('nomCrp')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomCrp && props.errors.nomCrp }</Text>

                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='poid'
                                                    onChangeText={props.handleChange('poid')}
                                                    value={props.values.poid}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('poid')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.poid && props.errors.poid }</Text>
                                                
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='mesure'
                                                    onChangeText={props.handleChange('mesure')}
                                                    value={props.values.mesure}
                                                    keyboardType='numeric'
                                                    onBlur={props.handleBlur('mesure')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.mesure && props.errors.mesure }</Text>

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
                <Text>{ nomCrp }</Text>
                <Text>{ poid }</Text>
                <Text>{ mesure }</Text>
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