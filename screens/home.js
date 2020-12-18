import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Image, TextInput, FlatList, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, BackHandler, AsyncStorage } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useFocusEffect } from '@react-navigation/native';
import {Calendar, LocaleConfig, CalendarList, Agenda} from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';

export default function Home({navigation}){

    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', function() {
                return false;
            });
            console.log('donne')
        })
    )

    const [modalOpen, setModalOpen] = useState(false);
    const [vaccindata, setVaccindata] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [rendezvous, setRendezvous] = useState([]);
    const [labo, setLabo] = useState([]);

    const [markedDates, setMarkedDates ] = useState({});

    const [vaccinModal, setVaccinModal] = useState([]);
    const [rendezvousModal, setRendezvousModal] = useState([]);
    const [laboModal, setLaboModal] = useState([]);


    const [initialState, setInitialState] = useState({});
    

    const vaccinDots = {key:'vaccinDots', color: '#fdcb9e' };
    const rendDots = {key:'rendDots', color: '#3f3f44'};
   const laboDots = {key:'laboDots', color: '#cceabb'};

    
    const vaccinmark = ()=> { 
            setMarkedDates(initialState);
            rendezvous.forEach((rend) => {
                vaccindata.forEach((vaccin) => {
                    labo.forEach((lab) => {
                    if(rend.date == vaccin.date && vaccin.date == lab.date){
                        console.log("threeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee are the same")
                     setMarkedDates((currentDate) => {
                         return {...{ [vaccin.date]: { dots: [laboDots, vaccinDots] ,selected: true, marked: true,  selectedColor: '#3f3f44' } }, ...currentDate};
                     });
                    }
                })
                })
            }) ;
            //--------------------------------------------------------------------
            rendezvous.forEach((rend) => {
                vaccindata.forEach((vaccin) => {
                    
                    if(rend.date == vaccin.date){
                        console.log("two are the same")
                     setMarkedDates((currentDate) => {
                         return {...{ [vaccin.date]: { dots: [vaccinDots] ,selected: true, marked: true,  selectedColor: '#3f3f44'} }, ...currentDate};
                     });
                    }
                })
            }) ;
            //---------------------------------------------------------------------
            rendezvous.forEach((rend) => {
                labo.forEach((lab) => {
                    
                    if(rend.date == lab.date){
                        console.log("two are the same")
                     setMarkedDates((currentDate) => {
                         return {...{ [lab.date]: { dots: [laboDots] ,selected: true, marked: true,  selectedColor: '#3f3f44'} }, ...currentDate};
                     });
                    }
                })
            }) ;
            //------------------------------------------------------------------------
            vaccindata.forEach((vaccin) => {
                labo.forEach((lab) => {
                    
                    if(vaccin.date == lab.date){
                        console.log("two are the same")
                     setMarkedDates((currentDate) => {
                         return {...{ [lab.date]: { dots: [laboDots] ,selected: true, marked: true,  selectedColor: '#fdcb9e'} }, ...currentDate};
                     });
                    }
                })
            }) ;
            //-----------------------------------------------------------------------
          vaccindata.forEach((values) => {
              setMarkedDates((currentDate) => {
                return {...{ [values.date]: { dots: [vaccinDots ] ,selected: true, marked: true,  selectedColor: '#fdcb9e'} }, ...currentDate};
            });
             } ) ; 
             //------------------------------------------------------------------------
              rendezvous.forEach((values) => {
                setMarkedDates((currentDate) => {
                  return {...{ [values.date]: {dots: [rendDots] ,selected: true, marked: true, selectedColor: '#3f3f44'} }, ...currentDate};
              }); 
               }) ;
               //-----------------------------------------------------------------------
               labo.forEach((values) => {
                setMarkedDates((currentDate) => {
                  return {...{ [values.date]: {dots: [laboDots] ,selected: true, marked: true, selectedColor: '#cceabb'} }, ...currentDate};
              });
               }) 


               
               console.log("markedDates are: ", markedDates);  
    };
   
    
    


    useFocusEffect(
        React.useCallback(() => {
            _retrieveVaccin();
            _retrieveLabo();
            _retrieveRendezvous();
           console.log("Final data is ", vaccindata);
            
        }, [])
    );

    useEffect(() => {
        retrieveDataHome();
        retrieveLaboHome();
        retrieveRendezvousHome();
    }, [])
  
    
    useEffect(() => {
       storeDataHome(); 
       storeLaboHome();
       storeRendezvousHome();
       vaccinmark();
    }, [vaccindata, rendezvous, labo ]);

    // store vaccins Home
    const storeDataHome = async () => {
        try {
            await AsyncStorage.setItem(
              'Vdata',
              JSON.stringify(vaccindata)
            );
            console.log("store vaccin data home is",vaccindata);
          } catch (error) {
            console.log('missed')
          }
      };
      //store Labo Home
      const storeLaboHome = async () => {
        try {
            await AsyncStorage.setItem(
              'labo',
              JSON.stringify(labo)
            );
           // console.log("store vaccin data home is",vaccindata);
          } catch (error) {
            console.log('missed')
          }
      };
      //store rendez vous home
      const storeRendezvousHome = async () => {
        try {
            await AsyncStorage.setItem(
              'rendez',
              JSON.stringify(rendezvous)
            );
            console.log("store rendezvoud data home is",rendezvous);
          } catch (error) {
            console.log('missed')
          }
      };


      //retreive vaccins home ----------------------------------------------------
    const retrieveDataHome = async () => {
        try {
            const value = await AsyncStorage.getItem('Vdata');
            if (value !== null) {
                console.log('returned');
                setVaccindata(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };
    //retreive labo home
    const retrieveLaboHome = async () => {
        try {
            const value = await AsyncStorage.getItem('labo');
            if (value !== null) {
                console.log('returned');
                setLabo(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };
     // retreive rendezvous home
     const retrieveRendezvousHome = async () => {
        try {
            const value = await AsyncStorage.getItem('rendez');
            if (value !== null) {
                console.log('returned');
                setRendezvous(JSON.parse(value));
            }
        } catch (error) {
            console.log('no value');
        }
    };

         //retreive Vaccins----------------------------------------------------
        const _retrieveVaccin = async () => {
            try {
                const value = await AsyncStorage.getItem('vaccins');
                if (value !== null) {
                    console.log('returned');
                    setVaccindata(JSON.parse(value));
                    
                }
            } catch (error) {
                console.log('no value');
            }
        };
        //retreive Labo
        const _retrieveLabo = async () => {
            try {
                const value = await AsyncStorage.getItem('testL');
                if (value !== null) {
                    console.log('returned');
                    setLabo(JSON.parse(value));
                }
            } catch (error) {
                console.log('no value');
            }
        };
        //retreive rendez-vous
        const _retrieveRendezvous = async () => {
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
        const onPress = (day) => {
            // console.log( "date is ", day.dateString )
            setVaccinModal([]);
            setRendezvousModal([]);
            setLaboModal([]);
              rendezvous.forEach((rendezv) => { 
                    if(day.dateString == rendezv.date){
                        setRendezvousModal((current) => {
                        return [rendezv, ...current];
                        });
                         
                        setModalOpen(true);
                    }
                })
                console.log("rendez vous modal are" ,rendezvousModal);
                vaccindata.forEach((vaccin) => { 
                    if(day.dateString == vaccin.date){
                        setVaccinModal((current) => {
                        return [vaccin, ...current];
                        });
                        
                        setModalOpen(true)
                    }
                    })
                    console.log("vaccin modal are" ,vaccinModal);
                    labo.forEach((lab) => { 
                        if(day.dateString == lab.date){
                            setLaboModal((current) => {
                            return [lab, ...current];
                            });
                            
                            setModalOpen(true)
                        }
                        })
         
        }
    
    

    const [users, setUsers] = useState([
        {name: 'SSS', password: '1234', key: '1'},
        {name: 'DDD', password: '1234', key: '2'},
        {name: 'CCC', password: '1234', key: '3'},
    ]);

    const UserSchema = yup.object({
        name: yup.string().required().min(2).max(20),
        password: yup.string().required().min(3).max(20),
    })


    const LoginUser = (user) => {
        users.forEach((item) => {
            if(item.name == user.name){
                console.log('loged');
            }else{
                console.log('not loged');
            }
        });
    }


        return(
            
            <View style={ globalStyles.container }>
            <Modal visible={modalOpen} animationType='slide'>
            <View style={styles.modalContainer}>
          <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
          <View style={globalStyles.container}>
          <FlatList
            data={vaccinModal}
            renderItem={({ item }) => {
                
               
                return(
                    
                    <TouchableOpacity onPress={() =>  { setModalOpen(false);
                        navigation.navigate('VaccinsDetails', item)} } >
                       <Card>
                            <View style={styles.icon}>
                                <Image style={globalStyles.menu} source={images.menu['vaccine']} />
                            <Text style={globalStyles.titleText}>Vaccins</Text>
                            </View>
                            
                           <View style={{marginTop: 10}}>
                            <Text style={globalStyles.bodyText}>{item.nomVacc} </Text>
                            <Text style={globalStyles.bodyText}>{item.date}     {item.time}</Text>  
                            </View> 
                        </Card>
                    </TouchableOpacity>
                
            )}}
        
            />
            <ScrollView>
            <FlatList
            data={rendezvousModal}
            renderItem={({ item }) => {
                
                return(
                    <TouchableOpacity onPress={() =>  { setModalOpen(false); 
                                                    navigation.navigate('RendezVousDetails', item);
                                                       }} >
                       <Card>
                       <View style={styles.icon}>
                                <Image style={globalStyles.menu} source={images.menu['rendez']} />
                            <Text style={globalStyles.titleText}>Rendez vous</Text>
                            </View>
                            <Text style={globalStyles.bodyText}> {item.nomRnd}</Text>
                            <Text style={globalStyles.bodyText}>{item.date} {item.time}</Text>   
                            
                        </Card>
                        </TouchableOpacity>
                    
            )}}
                
            />
            <FlatList
            data={laboModal}
            renderItem={({ item }) => {
                
                return(
                    <TouchableOpacity onPress={() =>  { setModalOpen(false); 
                                                    navigation.navigate('TestsLDetails', item);
                                                       }} >
                       <Card>
                       <View style={styles.icon}>
                                <Image style={globalStyles.menu} source={images.menu['testlab']} />
                            <Text style={globalStyles.titleText}>Test de Laboratoire</Text>
                            </View>
                            <Text style={globalStyles.bodyText}> {item.nomTest}</Text>
                            <Text style={globalStyles.bodyText}>{item.date} {item.time}</Text>   
                            
                        </Card>
                        </TouchableOpacity>
                    
            )}}
                
            />
            </ScrollView>
              </View>
             </View>
            </Modal>
            <Calendar
            style={styles.calendar}
            markedDates = {markedDates }
            markingType={'multi-dot'}
            onDayPress={(day)=>{ onPress(day)}}
            theme={{
              selectedDayBackgroundColor: 'green',
              todayTextColor: '#007892',
              arrowColor: '#007892',
            }}
            
          />
            <View style= {styles.pictures}>
                <View style= {styles.picPart}>
                    <View style= {styles.rendez} ></View>
                    <Text style={{ color: '#686a6b' }}>Rendez-vous</Text>
                </View>
                <View style= {styles.picPart}>
                <View style= {styles.labo} ></View>
                    <Text>Laboratoires</Text>
                </View>
                <View style= {styles.picPart}>
                    <View style= {styles.vaccin} ></View>
                    <Text> vaccin </Text>
                </View>
            </View>
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
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350,
        borderWidth: 1,
        borderColor: '#c5c7c9',
        borderRadius: 10,
      },
      pictures: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderWidth: 1,
          borderColor: '#c5c7c9',
          marginTop: 15,
          borderRadius: 10,
          paddingBottom: 10,
      },
      marker: {
        width: 36,
        height: 36,
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center',
      },
      picPart: {
        flexDirection: 'column',
      },
      rendez: {
        width: 36,
        height: 36,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#3f3f44'
      },
      labo: {
        width: 36,
        height: 36,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#cceabb'
      },
      vaccin: {
        width: 36,
        height: 36,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#fdcb9e'
      },
      icon: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
      },
});