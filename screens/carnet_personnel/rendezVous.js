import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, FlatList, ScrollView, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

export default function RendezVous({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [rendezvous, setRendezvous] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
        sendnotification();
    }, [rendezvous,route]);
    useEffect(() => {
        sendnotification();
    }, []);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'rendezvous',
              JSON.stringify(rendezvous)
            );
            console.log(rendezvous);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('rendezvous');
            if (value !== null) {
                console.log('returned');
                setRendezvous(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    const [text, setText] = useState('');

    //notifications
    const [notification, setNotification] = useState();
    var localNotification =  (values) =>
    ({ title: values.nomRnd, 
       body:"Vous avez un Rendez-vous aujourd'hui à "+values.time ,
       data: JSON.parse(JSON.stringify(values))
   }); 
   var send = (values) => {
      try {Keyboard.dismiss();
       var schedulingOptions = {
         time: new Date(values.date+'T'+values.time+'Z').getTime() ,
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
           console.warn('ok rend! got your notif');
           setNotification(notification);
           var {origin} = notification;
           console.log("_handleNotification", notification);
           if (origin === 'selected') {
           console.log('notif selected'); 
           console.log(notification.data)
          navigation.navigate('RendezVousDetails', notification.data) ;
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
         rendezvous.forEach((values) => {
             if(new Date().getTime() <= new Date(values.date+'T'+values.time+'Z').getTime() ){
         TimerNotification();
       send(values); 
   }
   } )    
   }
   
    //end notifications

    const addRendezvous = (rendezvous) => {
        rendezvous.key = Math.random().toString();
        rendezvous.userKey = global.userKey;
        setRendezvous((currentrendezvous) => {
            return [rendezvous, ...currentrendezvous];
        });
        try {
            db.collection('rendezvous').doc(rendezvous.key).set({
                key: rendezvous.key,
                userKey: rendezvous.userKey,
                nomRnd: rendezvous.nomRnd,
                doctor: rendezvous.doctor,
                date: rendezvous.date,
                time: rendezvous.time
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
        setRendezvous((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('rendezvous').doc(key).delete();
    }

    const rendezvousSchema = yup.object({
        nomRnd: yup.string().required().min(4).max(20),
        doctor: yup.string().required().min(4).max(60),
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
                                    initialValues={{ nomRnd:'', doctor:'', time:'', date:'' }}
                                    validationSchema={rendezvousSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addRendezvous(values);
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
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='add' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={rendezvous}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomRnd.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('RendezVousDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomRnd}</Text>
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