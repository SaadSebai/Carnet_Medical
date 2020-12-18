import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, Alert, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function Vaccins({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [vaccins, setVaccins] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
            sendnotification();
        }, [])
    );
    useEffect(() => {
        _storeData();
        sendnotification();
    }, [vaccins,route]);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'vaccins',
              JSON.stringify(vaccins)
            );
            console.log(vaccins);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('vaccins');
            if (value !== null) {
                console.log('returned');
                setVaccins(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    //notifications
    var localNotification =  (values) =>
    ({ title: values.nomVacc, 
       body:'you have a vaccin today on '+values.time ,
       data: JSON.parse(JSON.stringify(values))
   }); 
   var send = (values) => {
      try {Keyboard.dismiss();
       var schedulingOptions = {
         time: new Date(values.date+'T'+values.time+'Z').getTime()
           };
        
         Notifications.scheduleLocalNotificationAsync(localNotification(values),schedulingOptions );
       }
       catch(e) {
           console.log("time is missed")
       }
           // Notifications.dismissAllNotificationsAsync()
          };

          const cancelAllScheduled = () =>{
           Notifications.cancelAllScheduledNotificationsAsync();
       }

          var handleNotification = async (notification ) => {
           console.warn('ok vaccin! got your notif');
           setNotification(notification);
           var {origin} = notification;
           console.log("_handleNotification", notification);
           if (origin === 'selected') {
           console.log('notif selected'); 
           console.log(notification.data)
          navigation.navigate('VaccinsDetails', notification.data) ;
           } else {
             console.log('origin is received') 
           }
            };

            const askNotification = async () => {
               // We need to ask for Notification permissions for ios devices
                var { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                if (Constants.isDevice && status === 'granted')
               console.log('Notification permissions granted.');
               
            }
            var TimerNotification = () => {
               askNotification();
              var listener = Notifications.addListener(handleNotification); 
                  return () => listener.remove(); }
               
                 
     const sendnotification = ()=> { 
       cancelAllScheduled();
       console.log("cancel All");
         vaccins.forEach((values) => {
             if(new Date().getTime() <= new Date(values.date+'T'+values.time+'Z').getTime() ){
         TimerNotification();
       send(values); 
   }
   } )    
   }
   
    //end notifications

    const addVaccins = (vaccins) => {
        vaccins.key = Math.random().toString();
        vaccins.userKey = global.userKey;
        setVaccins((currentvaccins) => {
            return [vaccins, ...currentvaccins];
        });
        try {
            db.collection('vaccins').doc(vaccins.key).set({
                key: vaccins.key,
                userKey: vaccins.userKey,
                nomVacc: vaccins.nomVacc,
                date: vaccins.date,
                time: vaccins.time,
                description: vaccins.description
            });   
        } catch (error) {
            console.log('firebase error');
        }
        setModalOpen(false);
    }

    const supprimerAlert = (key) => {
        Alert.alert('supprimer','êtes-vous sûr de vouloir supprimer ce contenu?',[
            {text: 'No', onPress: () => console.log('No')},
            {text: 'Oui', onPress: () => (supprimer(key))}
        ]);
    }

    const supprimer = (key) => {
        console.log(key);
        setVaccins((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('vaccins').doc(key).delete();
    }

    const vaccinSchema = yup.object({
        nomVacc: yup.string().required().min(2).max(60),
        description: yup.string().required().min(2).max(300),
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
                                    <ScrollView>
                                    <Formik
                                    initialValues={{ nomVacc:'', description:'', date:'', time:'' }}
                                    validationSchema={vaccinSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addVaccins(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de vaccin'
                                                    onChangeText={props.handleChange('nomVacc')}
                                                    value={props.values.nomVacc}
                                                    onBlur={props.handleBlur('nomVacc')}
                                                />
                                                <Text style={globalStyles.errorText}>{ props.touched.nomVacc && props.errors.nomVacc }</Text>

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
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='add' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={vaccins}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomVacc.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('VaccinsDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomVacc}</Text>
                                <Text style={globalStyles.titleText}>{item.date}     {item.time}</Text>
                            </Card>
                        </TouchableOpacity>
                    </View>
                )}}
                />
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
    searchInput:{
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
});