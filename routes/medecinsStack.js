import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import Medecins from '../screens/medecins';
import MedecinsDetails from '../screens/details/medecinsDetails';

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

        <Stack.Screen name="Medecins" component={ Medecins } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title='Medecins' />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="MedecinsDetails" component={ MedecinsDetails } options={{title:"Medecin"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
