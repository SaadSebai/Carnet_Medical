import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import JoindreCompte from '../screens/joindreCompte';
import JoindreComptesDetails from '../screens/details/joindreComptesDetails';

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

        <Stack.Screen name="JoindreCompte" component={ JoindreCompte } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title='Joindre Compte' />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="JoindreComptesDetails" component={ JoindreComptesDetails } options={{title:"Compte"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
