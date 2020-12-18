import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';
import Header from '../Shared/header';
import VaccinsDetails from '../screens/carnet_personnel/details/vaccinsDetails';
import RendezVousDetails from '../screens/carnet_personnel/details/rendezVousDetails';
import TestsLDetails from '../screens/carnet_personnel/details/testsLDetails';

const Stack = createStackNavigator();

export default Navigator = () => {
  return (
        <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#e0d6d3',
          height: 80,
        },
        headerTintColor: '#333',
      }}>
          <Stack.Screen name="Home" component={ Home } options={({navigation}) => { 
            return(
              {headerTitle: () => <Header navigation={navigation} title='Accueil' />}
            )
          }} ></Stack.Screen>
          <Stack.Screen name="VaccinsDetails" component={ VaccinsDetails } options={{title:"Vaccins"}} ></Stack.Screen>
          <Stack.Screen name="RendezVousDetails" component={ RendezVousDetails } options={{title:"Rendez-Vous"}} ></Stack.Screen>
          <Stack.Screen name="TestsLDetails" component={ TestsLDetails } options={{title:"Tests de laboratoire"}} ></Stack.Screen>
        </Stack.Navigator>
  );
}