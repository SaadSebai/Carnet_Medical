import React, { useState, useEffect } from 'react';
import { StyleSheet, BackHandler, Text, Modal, View, Image, TextInput, Button, TouchableWithoutFeedback, Keyboard, AsyncStorage, Alert, CheckBox } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
import { useFocusEffect } from '@react-navigation/native';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }



export default function UserLogin({navigation, route}){

    var db = firebase.firestore();

    const [user, setUser] = useState([]);
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');
    const [pharmacie, setPharmacie] = useState([]);
    const [medecin, setMedecin] = useState([]);
    const [servicesUrg, setServicesUrg] = useState([]);
    const [joindreCompte, setJoindreCompte] = useState([]);
    const [hopitaux, setHopitaux] = useState([]);
    const [laboratoire, setLaboratoire] = useState([]);
    const [allergies, setallergies] = useState([]);
    const [anFams, setanFams] = useState([]);
    const [aMeds, setaMeds] = useState([]);
    const [chirurgies, setchirurgies] = useState([]);
    const [corps, setcorps] = useState([]);
    const [examens, setexamens] = useState([]);
    const [habitudes, sethabitudes] = useState([]);
    const [maladies, setmaladies] = useState([]);
    const [medicaments, setmedicaments] = useState([]);
    const [regms, setregms] = useState([]);
    const [ordonnances, setordonnances] = useState([]);
    const [rendezvous, setrendezvous] = useState([]);
    const [testL, settestL] = useState([]);
    const [vaccins, setvaccins] = useState([]);
    const [appelUrg, setappelUrg] = useState([]);

    const UserSchema = yup.object({
        email: yup.string().email().required().min(2).max(40),
        password: yup.string().required().min(3).max(40),
    })

    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', function() {
                return true;
            });
            firebaseData();
            setPharmacie([]);
            setMedecin([]);
            setServicesUrg([]);
            setJoindreCompte([]);
            setHopitaux([]);
            setLaboratoire([]);
            setallergies([]);
            setanFams([]);
            setaMeds([]);
            setchirurgies([]);
            setcorps([]);
            setexamens([]);
            sethabitudes([]);
            setmaladies([]);
            setmedicaments([]);
            setregms([]);
            setordonnances([]);
            setrendezvous([]);
            settestL([]);
            setvaccins([]);
            setappelUrg([]);
            console.log('clear');
        }, [])
    );

    useEffect(() => {
        if(step1 == 'step 1 donne'){
            firebaseDataPharmacie();
            firebaseDataLaboratoire();
            firebaseDataServicesUrg();
            firebaseDataHopitaux();
            firebaseDataJoindreCompte();
            firebaseDataMedecin();
            firebaseDataallergies();
            firebaseDataanFams();
            firebaseDataaMeds();
            firebaseDatachirurgies();
            firebaseDatacorps();
            firebaseDataexamens();
            firebaseDatahabitudes();
            firebaseDatamaladies();
            firebaseDatamedicaments();
            firebaseDataregms();
            firebaseDataordonnances();
            firebaseDatarendezvous();
            firebaseDatatestL();
            firebaseDatavaccins();
            firebaseDataappelUrg();
            setStep1('');
        }else{
            console.log('not now')
        }
    }, [step1]);

    useEffect(() => {
        if(step2 == 'step 2 donne'){
            _storeDataPharmacies();
            _storeDataMedecins();
            _storeDataServicesUrgs();
            _storeDataJoindreComptes();
            _storeDataHopitaux();
            _storeDatalaboratoires();
            _storeDataallergies();
            _storeDataanFams();
            _storeDataaMeds();
            _storeDatachirurgies();
            _storeDatacorps();
            _storeDataexamens();
            _storeDatahabitudes();
            _storeDatamaladies();
            _storeDatamedicaments();
            _storeDataregms();
            _storeDataordonnances();
            _storeDatarendezvous();
            _storeDatatestL();
            _storeDatavaccins();
            _storeDataappelUrg();
            setStep2('');
        }
    }, [step2]);

    
    const [modalOpen, setModalOpen] = useState(false);

    // const LoginUser = (u) => {
    //     try {
    //         firebase.auth().signInWithEmailAndPassword(u.email, u.password).then(navigation.navigate('Home'))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    

    var BreakException = {};

    const LoginUser = (u) => {
        try{
            user.forEach((element) => {
            if(element.email == u.email && element.password == u.password){
                global.userKey = element.key;
                setStep1('step 1 donne');
                setModalOpen(true);
                _storeDataUser(element);
                throw BreakException;
            }
        })}catch(e){
            if(e!==BreakException) throw e;
            console.log('login fail')
        }
    }

    const toHome = () => {
        setModalOpen(false);
        navigation.navigate('Home');
    }

    //user login

    const firebaseData = () => {
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var user = doc.data();
                setUser((currentuser) => {
                    return [user, ...currentuser];
                });
            })
            console.log(user)
        })
    }
    //getting user info

    const firebaseDataPharmacie = async () => {
        db.collection('pharmacies').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var pharmacie = doc.data();
                setPharmacie((currentpharmacie) => {
                    return [pharmacie, ...currentpharmacie];
                });
            })
            console.log(pharmacie)
        })
    }
    const firebaseDataLaboratoire = async () => {
        db.collection('laboratoires').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var laboratoire = doc.data();
                setLaboratoire((currentlaboratoire) => {
                    return [laboratoire, ...currentlaboratoire];
                });
            })
            
            console.log(laboratoire)
        })
    }
    const firebaseDataHopitaux = async () => {
        db.collection('hopitaux').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var hopitaux = doc.data();
                setHopitaux((currenthopitaux) => {
                    return [hopitaux, ...currenthopitaux];
                });
            })
            
            console.log(pharmacie)
        })
    }
    const firebaseDataJoindreCompte = async () => {
        db.collection('joindreComptes').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var joindreCompte = doc.data();
                setJoindreCompte((currentjoindreCompte) => {
                    return [joindreCompte, ...currentjoindreCompte];
                });
            })
            
            console.log(joindreCompte)
        })
    }
    const firebaseDataServicesUrg = async () => {
        db.collection('servicesUrgs').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var servicesUrg = doc.data();
                setServicesUrg((currentservicesUrg) => {
                    return [servicesUrg, ...currentservicesUrg];
                });
            })
            
            console.log(servicesUrg)
        })
    }
    const firebaseDataMedecin = async () => {
        db.collection('medecins').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var medecin = doc.data();
                setMedecin((currentmedecin) => {
                    return [medecin, ...currentmedecin];
                });
            })
            
            console.log(medecin)
        })
    };
    
    const firebaseDataallergies = async () => {
        db.collection('allergies').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var allergies = doc.data();
                setallergies((currentallergies) => {
                    return [allergies, ...currentallergies];
                });
            })
            
            console.log(allergies)
        })
    };
    const firebaseDataanFams = async () => {
        db.collection('anFams').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var anFams = doc.data();
                setanFams((currentanFams) => {
                    return [anFams, ...currentanFams];
                });
            })
            
            console.log(anFams)
        })
    };
    const firebaseDataaMeds = async () => {
        db.collection('aMeds').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var aMeds = doc.data();
                setaMeds((currentaMeds) => {
                    return [aMeds, ...currentaMeds];
                });
            })
            
            console.log(aMeds)
        })
    };
    
    const firebaseDatachirurgies = async () => {
        db.collection('chirurgies').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var chirurgies = doc.data();
                setchirurgies((currentchirurgies) => {
                    return [chirurgies, ...currentchirurgies];
                });
            })
            
            console.log(chirurgies)
        })
    };
    const firebaseDatacorps = async () => {
        db.collection('corps').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var corps = doc.data();
                setcorps((currentcorps) => {
                    return [corps, ...currentcorps];
                });
            })
            
            console.log(corps)
        })
    };
    const firebaseDataexamens = async () => {
        db.collection('examens').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var examens = doc.data();
                setexamens((currentexamens) => {
                    return [examens, ...currentexamens];
                });
            })
            
            console.log(examens)
        })
    };
    const firebaseDatahabitudes = async () => {
        db.collection('habitudes').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var habitudes = doc.data();
                sethabitudes((currenthabitudes) => {
                    return [habitudes, ...currenthabitudes];
                });
            })
            
            console.log(habitudes)
        })
    };
    const firebaseDatamaladies = async () => {
        db.collection('maladies').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var maladies = doc.data();
                setmaladies((currentmaladies) => {
                    return [maladies, ...currentmaladies];
                });
            })
            
            console.log(maladies)
        })
    };
    const firebaseDatamedicaments = async () => {
        db.collection('medicaments').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var medicaments = doc.data();
                setmedicaments((currentmedicaments) => {
                    return [medicaments, ...currentmedicaments];
                });
            })
            
            console.log(medicaments)
        })
    };
    const firebaseDataregms = async () => {
        db.collection('regms').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var regms = doc.data();
                setregms((currentregms) => {
                    return [regms, ...currentregms];
                });
            })
            
            console.log(regms)
        })
    };
    const firebaseDataordonnances = async () => {
        db.collection('ordonnances').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var ordonnances = doc.data();
                setordonnances((currentordonnances) => {
                    return [ordonnances, ...currentordonnances];
                });
            })
            
            console.log(ordonnances)
        })
    };
    const firebaseDatarendezvous = async () => {
        db.collection('rendezvous').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var rendezvous = doc.data();
                setrendezvous((currentrendezvous) => {
                    return [rendezvous, ...currentrendezvous];
                });
            })
            
            console.log(rendezvous)
        })
    };
    const firebaseDatatestL = async () => {
        db.collection('testL').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var testL = doc.data();
                settestL((currenttestL) => {
                    return [testL, ...currenttestL];
                });
            })
            
            console.log(testL)
        })
    };
    const firebaseDatavaccins = async () => {
        db.collection('vaccins').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var vaccins = doc.data();
                setvaccins((currentvaccins) => {
                    return [vaccins, ...currentvaccins];
                });
            })
            setStep2('step 2 donne');
            console.log(vaccins)
        })
    };
    const firebaseDataappelUrg = async () => {
        db.collection('appelUrg').where('userKey', '==', global.userKey).get().then((snapshot) => {
            snapshot.docs.forEach((doc) =>{
                var appelUrg = doc.data();
                setappelUrg((currentappelUrg) => {
                    return [appelUrg, ...currentappelUrg];
                });
            })
            setStep2('step 2 donne');
            console.log(appelUrg)
        })
    };
    
    //saving user info

    const _storeDataUser = async (u) => {
        try {
            await AsyncStorage.setItem(
              'user',
              JSON.stringify(u)
            );
            console.log(u);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatalaboratoires = async () => {
        try {
            await AsyncStorage.setItem(
              'laboratoires',
              JSON.stringify(laboratoire)
            );
            console.log(laboratoire);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataPharmacies = async () => {
        try {
            await AsyncStorage.setItem(
              'pharmacies',
              JSON.stringify(pharmacie)
            );
            console.log(pharmacie);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataHopitaux = async () => {
        try {
            await AsyncStorage.setItem(
              'hopitaux',
              JSON.stringify(hopitaux)
            );
            console.log(hopitaux);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataJoindreComptes = async () => {
        try {
            await AsyncStorage.setItem(
              'joindreComptes',
              JSON.stringify(joindreCompte)
            );
            console.log(joindreCompte);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataMedecins = async () => {
        try {
            await AsyncStorage.setItem(
              'medecins',
              JSON.stringify(medecin)
            );
            console.log(medecin);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataServicesUrgs = async () => {
        try {
            await AsyncStorage.setItem(
              'servicesUrgs',
              JSON.stringify(servicesUrg)
            );
            console.log(servicesUrg);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataallergies = async () => {
        try {
            await AsyncStorage.setItem(
              'allergies',
              JSON.stringify(allergies)
            );
            console.log(allergies);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataanFams = async () => {
        try {
            await AsyncStorage.setItem(
              'anFams',
              JSON.stringify(anFams)
            );
            console.log(anFams);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataaMeds = async () => {
        try {
            await AsyncStorage.setItem(
              'aMeds',
              JSON.stringify(aMeds)
            );
            console.log(aMeds);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatachirurgies = async () => {
        try {
            await AsyncStorage.setItem(
              'chirurgies',
              JSON.stringify(chirurgies)
            );
            console.log(chirurgies);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatacorps = async () => {
        try {
            await AsyncStorage.setItem(
              'corps',
              JSON.stringify(corps)
            );
            console.log(corps);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataexamens = async () => {
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
    const _storeDatahabitudes = async () => {
        try {
            await AsyncStorage.setItem(
              'habitudes',
              JSON.stringify(habitudes)
            );
            console.log(habitudes);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatamaladies = async () => {
        try {
            await AsyncStorage.setItem(
              'maladies',
              JSON.stringify(maladies)
            );
            console.log(maladies);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatamedicaments = async () => {
        try {
            await AsyncStorage.setItem(
              'medicaments',
              JSON.stringify(medicaments)
            );
            console.log(medicaments);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataregms = async () => {
        try {
            await AsyncStorage.setItem(
              'regms',
              JSON.stringify(regms)
            );
            console.log(regms);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDataordonnances = async () => {
        try {
            await AsyncStorage.setItem(
              'ordonnances',
              JSON.stringify(ordonnances)
            );
            console.log(ordonnances);
        } catch (error) {
            console.log('missed')
        }
    };
    const _storeDatarendezvous = async () => {
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
    const _storeDatatestL = async () => {
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
    const _storeDatavaccins = async () => {
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
    const _storeDataappelUrg = async () => {
        try {
            await AsyncStorage.setItem(
              'appelUrg',
              JSON.stringify(appelUrg)
            );
            console.log(appelUrg);
        } catch (error) {
            console.log('missed')
        }
        toHome();
    };

        return(
            
            <View style={ globalStyles.container }>

                <Modal visible={modalOpen} animationType='slide'>
                    <View style={styles.modalContainer}>
                    <Image style={styles.loadingImg} source={require('../assets/Loading.gif')} />
                    </View>
                </Modal>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={globalStyles.container}>
                            <Formik
                            initialValues={{ email:'', password:''}}
                            validationSchema={UserSchema}
                            onSubmit={(values,actions) => {
                                actions.resetForm();
                                LoginUser(values);
                                
                            }}
                            >
                                {(props) => (
                                    <View>
                                        <Text>Email d'utilisateur :</Text>
                                        <TextInput
                                            style={globalStyles.input}
                                            placeholder='User email'
                                            onChangeText={props.handleChange('email')}
                                            value={props.values.email}
                                            keyboardType='email-address'
                                            onBlur={props.handleBlur('email')}
                                        />
                                        <Text style={globalStyles.errorText}>{ props.touched.email && props.errors.email }</Text>

                                        <Text>Mote de passe :</Text>
                                        <TextInput
                                            multiline
                                            miniHeight={60}
                                            style={globalStyles.input}
                                            placeholder='User password'
                                            onChangeText={props.handleChange('password')}
                                            value={props.values.password}
                                            keyboardType='visible-password'
                                            onBlur={props.handleBlur('password')}
                                        />
                                        <Text style={globalStyles.errorText}>{ props.touched.password && props.errors.password }</Text>
                                        

                                        <Button title='Log-In' color='#3f3f44' onPress={props.handleSubmit} />
                                    </View>
                                )}
                                </Formik>
                            <Text style={{color: '#0390fc', marginTop: 30,alignSelf: 'center',}}
                                onPress={() => navigation.navigate('UserSignup')}>
                            Sign Up!
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    loadingImg: {
        alignSelf: 'center',
        width:400,
        height:400,
    }
});