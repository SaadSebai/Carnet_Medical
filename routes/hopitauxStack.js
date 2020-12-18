import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import Hopitaux from '../screens/hopitaux';
import HopitauxDetails from '../screens/details/hopitauxDetails';

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

        <Stack.Screen name="Hopitaux" component={ Hopitaux } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title="Hôpitaux et cliniques" />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="HopitauxDetails" component={ HopitauxDetails } options={{title:"Hôpital et clinique"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
