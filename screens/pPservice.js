import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, FlatList, Alert, TouchableOpacity, Modal, ScrollView, Button, TouchableWithoutFeedback, Keyboard, Image, Picker } from 'react-native';
import { globalStyles, images } from '../styles/global';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Card from '../Shared/card';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import * as firebase from 'firebase';
import "firebase/firestore";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export default function PPservice({navigation, route}){
    
    const [modalOpen, setModalOpen] = useState(false);
    const [LT, setLT] = useState(0);
    const [LG, setLG] = useState(0);

    const [pharmacier, setpharmacier] = useState([
        {nom:"Pharmacie Rincon" ,latitude:35.684894,longitude: -5.322420 },
        {nom:"Pharmacie Kharkhour" ,latitude: 35.683070, longitude: -5.323850},
        {nom:"Pharmacie Annasr" ,latitude :35.680595,longitude:-5.325575},
        {nom:"Pharmacie CHIFAE" ,latitude:35.686595,longitude:-5.328411},
        {nom:"Pharmacie Ibn Batouta" ,latitude :35.686411,longitude:-5.3258583},
        {nom:"Pharmacie ALAMI" ,latitude :35.681171,longitude:-5.324932},
        {nom:"Pharmacie sidi boughaba" ,latitude:35.6865932,longitude:-5.3258583},
        {nom:"pharmacie hay al kalaa" ,latitude:35.680562,longitude:-5.330274},
        {nom:"Pharmacie Touebla" ,latitude:35.564747,longitude:-5.398837},
        {nom:"Pharmacie Achaab" ,latitude:35.574484,longitude:-5.382256},
        {nom:"Pharmacie Avenue des F.A.R" ,latitude:35.573970,longitude:-5.360514},
        {nom:"Pharmacie Al Amal" ,latitude:35.584434,longitude:-5.358230},
        {nom:"Pharmacie Ain Melloul" ,latitude:35.584044,longitude:-5.341276},
        {nom:"Pharmacie Marjane" ,latitude:35.602440,longitude:-5.335104}
      ])
      const [Cabinet , setCabinet ] = useState([
       {nom:"Cabinet dentaire Dr Zouaki" ,latitude:35.843857,longitude:-5.354594}, 
       {nom:"Cabinet Assarroukh ijlal de Kinésithérapie" ,latitude:35.615133,longitude:-5.279582},
       {nom:"Cabinet dentaire mutuelle mgen " ,latitude:35.588912,longitude:-5.345088},
       {nom:"Cabinet Dr.azdi Mohammed Ayman" ,latitude:35.757431,longitude:-5.356407},
       {nom:"Cabinet Dentaire Dr. Ali Laamarti " ,latitude:35.582440,longitude:-5.345365},
       {nom:"Cabinet Dentaire Moudden Ahmed" ,latitude:35.592890,longitude:-5.351067},
       {nom:"Cabinet Ryani" ,latitude:35.6865932,longitude:-5.3258583},
       {nom:"Cabinet Dentaire Dr. Hanaa ABRID" ,latitude:35.581361,longitude:-5.352562},
       {nom:"Cabinet dentaire Dr Mariam Fassi Halfaoui" ,latitude:35.580422,longitude:-5.353693},
       {nom:"CABINET Dr BERROHO" ,latitude:35.571957,longitude:-5.359423},
       {nom:"cabinet medical adil mestassi" ,latitude:35.569952,longitude:-5.370271},
       {nom:"Cabinet Dr Touili -Pneumologue Phtisiologue" ,latitude:35.569882,longitude:-5.355817},
       {nom:"Docteur SOLAIMAN ZOHAIR (Cabinet dentaire)" ,latitude:35.571058,longitude:-5.377103},
       {nom:"orthoptie loukach cabinet" ,latitude:35.571146,longitude:-5.379091},
       {nom:"Cabinet de cardiologie Dr. CHAOUI Alae" ,latitude:35.571230,longitude:-5.385346}
    ])   
     const [Laboratoire , setLaboratoire ] = useState([
        {nom:"LABORATOIRE D'ANALYSES MÉDICALES LAPLAYA - Dr Ezzat derdabi" ,latitude:35.620397,longitude:-5.271854}, 
        {nom:"Laboratoire Av FARe" ,latitude:35.583181,longitude:-5.350794},
        {nom:"Laboratoire Central de Tetouan" ,latitude:35.573665,longitude:-5.360042},
        {nom:"Le Laboratoire Du Nord Dr Chaoui" ,latitude:35.572029,longitude:-5.359513},
        {nom:"Laboratorio Dental Laser" ,latitude:35.559768,longitude:-5.371754},
        {nom:"Laboratoire Ibn Annafis" ,latitude:35.569175,longitude:-5.373634},
        {nom:"LABORATOIRE AL RAZI D'ANALYSES MEDICALES" ,latitude:35.569701,longitude:-5.376298},
        {nom:"Medical laboratory El bakouri" ,latitude:35.570953,longitude:-5.376572},
        {nom:"Laboratoire Errazi D'Analyses Medicales" ,latitude:35.571568,longitude:-5.375849},
        {nom:"Laboratoire d'analyses médicales Derdabi" ,latitude:35.571808,longitude:-5.379966},
        {nom:"Medical laboratory El bakouri" ,latitude:35.570950,longitude:-5.376570},
        {nom:"Laboratoire slaoui d'analyse medicale" ,latitude:35.571243,longitude:-5.380214},
    ])
    const [Clinique  , setClinique  ] = useState([
        {nom:"المركز الصحي الملاليين",latitude :35.627487,longitude:-5.340978},
        {nom:"Dispensaire",latitude:35.574760,longitude:-5.396585},
        {nom:"Clinique du Croissant Rouge Marocain",latitude:35.571546,longitude:-5.387528},
        {nom:"مصحة تطوان",latitude:35.570737,longitude:-5.385776},
        {nom:"Clinique de Tetouan",latitude:35.570916,longitude:-5.385643},
        {nom:"Clinique NAKHIL",latitude:35.568930,longitude:-5.381404},
        {nom:"Clinique Rif",latitude:35.586736,longitude:-5.346869},
        {nom:"Clinique de la Vision de Tétouan",latitude:35.585995,longitude:-5.336706},
        {nom:"CENTRE D'HEMODIALYSE DE TETOUAN",latitude:35.583038,longitude:-5.350506},
        {nom:"عيادة الدكتور جعفر عبدالوهاب",latitude:35.569701,longitude:-5.376298},
        {nom:"عيادة طب العيون للدكتور أحمد الشمس",latitude:35.586088,longitude:-5.348916},
        {nom:"مستشفى سمسة",latitude:35.574796,longitude:-5.396522},
    ])
    const [Radiologie , setRadiologie ] = useState([
      {nom:"Dr SAOUD Idriss Cabinet ORL" ,latitude:35.586506,longitude:-5.349469}, 
      {nom:"CENTRE D'HEMODIALYSE DE TETOUAN" ,latitude:35.583043,longitude:-5.350588},
      {nom:"Cabinet Dentaire Dr. Hanaa ABRID" ,latitude:35.581365,longitude:-5.352566},
      {nom:"Dr Ferdaous Sahnoun - Pneumologue Tétouan" ,latitude:35.580385,longitude:-5.353650},
      {nom:"cabinet de diététique, nutrition et amincissement" ,latitude:35.579751,longitude:-5.354679},
      {nom:"مختبر التحاليل الطبية المامون" ,latitude:35.578339,longitude:-5.356249},
      {nom:"Cabinet dr El Allali Soukaina" ,latitude:35.572161,longitude:-5.359451},
      {nom:"Dr OUAZZANI MEKKI" ,latitude:35.569413,longitude:-5.372054},
      {nom:"Cabinet Dr Imad Rahmani" ,latitude:35.572838,longitude:-5.378503},
      {nom:"Clinique NAKHIL" ,latitude:35.568922,longitude:-5.381439},
      {nom:"Cabinet de cardiologie Dr. CHAOUI Alae" ,latitude:35.571227,longitude:-5.385384},
    ])
    const [ServiceUrgence , setServiceUrgence ] = useState([
      {nom:"Ambulance Tetouan - Ceuta" ,latitude:35.580004,longitude:-5.357834}, 
      {nom:"SOS Ambulance TANGER" ,latitude:35.579771,longitude:-5.358750},
      {nom:"Commune de tetouan Bureau communal d'hygiène et service medico legal" ,latitude:35.567818,longitude:-5.405906},
    ])

      const initialState = {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }
    const [CurrentPosition, setCurrentPosition] = useState(initialState);
    const [selectedValue, setSelectedValue] = useState("Laboratoire");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
        //alert(JSON.stringify(position))
        const {latitude,longitude}=position.coords;
        setCurrentPosition({
            ...CurrentPosition,
            latitude,
            longitude,
        })
        },
        error => alert(error.message),
        { timeout:20000,maximumAge:1000 }

        )
    }, [])

    const ppsevPharmacier = (userPlace) => {
        
        var des = 999999999999999999999999;
        pharmacier.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }

    const ppsevCabinet = (userPlace) => {
        
        var des = 999999999999999999999999;
        Cabinet.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }

    const ppsevLaboratoire = (userPlace) => {
        
        var des = 999999999999999999999999;
        Laboratoire.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }

    const ppsevClinique = (userPlace) => {
        
        var des = 999999999999999999999999;
        Clinique.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }

    const ppsevRadiologie = (userPlace) => {
        
        var des = 999999999999999999999999;
        Radiologie.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }

    const ppsevServiceUrgence = (userPlace) => {
        
        var des = 999999999999999999999999;
        ServiceUrgence.forEach(element => {
            var userLt = 0;
            var userLg = 0;
            if(userPlace.latitude < 0)
                userLt = userPlace.latitude * (-1);
            else
                userLt = userPlace.latitude;
            
            if(userPlace.longitude < 0)
                userLg = userPlace.longitude * (-1);
            else
                userLg = userPlace.longitude;
            ////////////////////////////////////////////

            var eleLt = 0;
            var eleLg = 0;

            if(element.latitude < 0)
                eleLt = element.latitude * (-1);
            else
                eleLt = element.latitude;
            
            if(element.longitude < 0)
                eleLg = element.longitude * (-1);
            else
                eleLg = element.longitude;
            
            var desLt = userLt - eleLt;
            var desLg = userLg - eleLg;

            if(desLt < 0)
                desLt = desLt * (-1);
            if(desLg < 0)
                desLg = desLg * (-1);

            var desNew = desLg + desLt
            if(desNew < des){
                des = desNew;
                setLG(element.longitude);
                setLT(element.latitude);
            }
            console.log(des)
        });

    }
    
        return(
            <View style={ globalStyles.container }>
                <View style={{alignItems: 'center'}}>
                <TouchableOpacity title='Laboratoire' style onPress={() => {ppsevLaboratoire(CurrentPosition);setModalOpen(true);}} ><Text style={styles.styletext}>Laboratoire</Text></TouchableOpacity>
                <TouchableOpacity title='Clinique' onPress={() => {ppsevClinique(CurrentPosition);setModalOpen(true)}} ><Text style={styles.styletext}>Clinique</Text></TouchableOpacity>
                <TouchableOpacity title="Service d'urgence" onPress={() => {ppsevServiceUrgence(CurrentPosition);setModalOpen(true)}} ><Text style={styles.styletext}>Service d'urgence</Text></TouchableOpacity>
                <TouchableOpacity title='Cabinet' onPress={() => {ppsevCabinet(CurrentPosition);setModalOpen(true)}} ><Text style={styles.styletext}>Cabinet</Text></TouchableOpacity>
                <TouchableOpacity title='Radiologie' onPress={() => {ppsevRadiologie(CurrentPosition);setModalOpen(true)}} ><Text style={styles.styletext}>Radiologie</Text></TouchableOpacity>
                <TouchableOpacity title='Pharmacie' onPress={() => {ppsevPharmacier(CurrentPosition);setModalOpen(true)}} ><Text style={styles.styletext}>Pharmacie</Text></TouchableOpacity>
                </View>

                <Modal visible={modalOpen} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <MaterialIcons name='close' size={24} style={{ ...styles.modalToggle, ...styles.modalClose}}  onPress={() =>setModalOpen(false) }/>
                                <View style={globalStyles.container}>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={{ flex: 1 }}
                                    showsUserLocation
                                    initialRegion={CurrentPosition}
                                    >
                                        <Marker
                                            coordinate={{latitude: LT, longitude: LG}}
                                            title="this is a marker"
                                            description="this is a marker example"
                                        />
                                    </MapView>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>

            
        )
}

const styles = StyleSheet.create ({
    modalContainer:{
        flex: 1,
    },
    modalToggle:{
        borderWidth: 1,
        borderColor: '#f2f2f3',
        borderRadius: 10,
        alignSelf: 'center',
    },
    modalClose: {
        marginBottom: 0,
        marginTop: 20,
    },
    searchInput:{
        padding: 10,
        marginBottom:20,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    non:{
        flexDirection:'row',
      },
    styletext: { 
        fontSize:22,
        color:"#333",
        textAlign:'center',
        marginBottom:23,
        width:220,
        height :55,
    },
    text:{
        textAlign:'center',
        color:"#333",
        fontSize:20,
        marginBottom:10,
    },
});