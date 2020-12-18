import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import Favoris from '../screens/favoris';
import FavoriHopitauxDetails from '../screens/favoriDetails/favoriHopitauxDetails';
import FavoriPharmaciesDetails from '../screens/favoriDetails/favoriPharmaciesDetails';
import FavoriMedecinsDetails from '../screens/favoriDetails/favoriMedecinsDetails';
import FavoriLaboratoiresDetails from '../screens/favoriDetails/favoriLaboratoiresDetails';
import FavoriServicesUrgsDetails from '../screens/favoriDetails/favoriServicesUrgsDetails';

const Stack = createStackNavigator();

export default Navigator = () => {
  return (
        <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#e0d6d3',
          height: 80,
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>

        <Stack.Screen name="Favoris" component={ Favoris } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title="Liste des Favoris" />}
            )
        }} >

        </Stack.Screen>
        <Stack.Screen name="FavoriHopitauxDetails" component={ FavoriHopitauxDetails } options={{title:"Hôpital et clinique"}} ></Stack.Screen>
        <Stack.Screen name="FavoriPharmaciesDetails" component={ FavoriPharmaciesDetails } options={{title:"Pharmacie"}} ></Stack.Screen>
        <Stack.Screen name="FavoriMedecinsDetails" component={ FavoriMedecinsDetails } options={{title:"Medecin"}} ></Stack.Screen>
        <Stack.Screen name="FavoriLaboratoiresDetails" component={ FavoriLaboratoiresDetails } options={{title:"Laboratoire"}} ></Stack.Screen>
        <Stack.Screen name="FavoriServicesUrgsDetails" component={ FavoriServicesUrgsDetails } options={{title:"Services d'urgence"}} ></Stack.Screen>
        </Stack.Navigator>
  );
}
