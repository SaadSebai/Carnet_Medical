import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, ScrollView, Alert, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function Examens({route, navigation}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [examens, setExamens] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        sendnotification();
    }, [examens,route]);
    
    useEffect(() => {
        sendnotification();
    }, []);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'examens',
              JSON.stringify(examens)
            );
            console.log(examens);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('examens');
            if (value !== null) {
                console.log('returned');
                setExamens(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    //notifications
    const [notification, setNotification] = useState();
    var localNotification =  (values) =>
    ({ title: values.nomExm, 
       body:"Vous avez un examen aujourd'hui à "+values.time ,
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
          navigation.navigate('ExamensDetails', notification.data) ;
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
         examens.forEach((values) => {
             if(new Date().getTime() <= new Date(values.date+'T'+values.time+'Z').getTime() ){
         TimerNotification();
       send(values); 
   }
   } )    
   }
   
    //end notifications

    const addExamens = (examens) => {
        examens.key = Math.random().toString();
        examens.userKey = global.userKey;
        setExamens((currentExamens) => {
            return [examens, ...currentExamens];
        });
        try {
            db.collection('examens').doc(examens.key).set({
                key: examens.key,
                userKey: examens.userKey,
                nomExm: examens.nomExm,
                hopitalNom: examens.hopitalNom,
                date: examens.date,
                time: examens.time,
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
        setExamens((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('examens').doc(key).delete();
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
                                    <ScrollView>
                                    <Formik
                                    initialValues={{ nomExm:'', hopitalNom:'', date:'', time:'' }}
                                    validationSchema={ExamenSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addExamens(values);
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
                data={examens}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomExm.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('ExamensDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomExm}</Text>
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