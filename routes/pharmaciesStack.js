import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import Pharmacies from '../screens/pharmacies';
import PharmaciesDetails from '../screens/details/pharmaciesDetails';

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

        <Stack.Screen name="Pharmacies" component={ Pharmacies } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title='Pharmacies' />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="PharmaciesDetails" component={ PharmaciesDetails } options={{title:"Pharmacie"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
