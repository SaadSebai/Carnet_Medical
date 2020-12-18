import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import ServicesUrgs from '../screens/servicesUrgs';
import ServicesUrgsDetails from '../screens/details/servicesUrgsDetails';

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

        <Stack.Screen name="ServicesUrgs" component={ ServicesUrgs } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title="Services d'urgences" />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="ServicesUrgsDetails" component={ ServicesUrgsDetails } options={{title:"Services d'urgence"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
