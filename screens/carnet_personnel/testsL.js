import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, FlatList, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Keyboard, AsyncStorage } from 'react-native';
import { globalStyles } from '../../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-native-datepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function TestL({navigation, route}){

    var db = firebase.firestore();

    const [modalOpen, setModalOpen] = useState(false);
    const [testL, setTestL] = useState([]);

    const [text, setText] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            _retrieveData();
        }, [])
    );
    useEffect(() => {
        _storeData();
        sendnotification();
    }, [testL,route]);

    useEffect(() => {
        sendnotification();
    }, []);

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem(
              'testL',
              JSON.stringify(testL)
            );
            console.log(testL);
          } catch (error) {
            console.log('missed')
          }
      };

    const _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('testL');
            if (value !== null) {
                console.log('returned');
                setTestL(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

    //notifications
    const [notification, setNotification] = useState();
    var localNotification =  (values) =>
    ({ title: values.nomTest, 
       body:"Vous avez un test de laboratoire aujourd'hui à "+values.time ,
       data: JSON.parse(JSON.stringify(values))
   }); 
   var send = (values) => {
      try {Keyboard.dismiss();
       var schedulingOptions = {
         time: new Date(values.date+'T'+values.time+'Z').getTime() - 3600,
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
          navigation.navigate('TestsLDetails', notification.data) ;
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
         testL.forEach((values) => {
             if(new Date().getTime() <= new Date(values.date+'T'+values.time+'Z').getTime() ){
         TimerNotification();
       send(values); 
   }
   } )    
   }
   
    //end notifications

    const addTestL = (testL) => {
        testL.key = Math.random().toString();
        testL.userKey = global.userKey;
        setTestL((currenttestL) => {
            return [testL, ...currenttestL];
        });
        try {
            db.collection('testL').doc(testL.key).set({
                key: testL.key,
                userKey: testL.userKey,
                nomTest: testL.nomTest,
                resultat: testL.resultat,
                date: testL.date,
                time: testL.time
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
        setTestL((prev) => {
            return prev.filter(am => am.key != key)
        })
        db.collection('testL').doc(key).delete();
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
                                    <ScrollView>
                                    <Formik
                                    initialValues={{ nomTest:'', date:'', time:'', resultat:'' }}
                                    validationSchema={testLSchema}
                                    onSubmit={(values,actions) => {
                                        actions.resetForm();
                                        addTestL(values);
                                    }}
                                    >
                                        {(props) => (
                                            <View>
                                                <TextInput
                                                    style={globalStyles.input}
                                                    placeholder='nom de test'
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
                                    </ScrollView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <MaterialIcons name='add' size={24} style={styles.modalToggle}  onPress={() =>setModalOpen(true) }/>

                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={ (text) => setText(text)} />

                <FlatList
                data={testL}
                renderItem={({ item }) => {
                    if(item.userKey == global.userKey)
                    if(item.nomTest.startsWith(text))
                    return(
                    <View>
                        <MaterialIcons name='close' size={15} onPress={() => supprimerAlert(item.key)}/>
                        <TouchableOpacity onPress={() => navigation.navigate('TestsLDetails', item) }>
                            <Card>
                                <Text style={globalStyles.titleText}>{item.nomTest}</Text>
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