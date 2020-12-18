import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import AppelUrg from '../screens/appelUrg';

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

        <Stack.Screen name="AppelUrg" component={ AppelUrg } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title="Appel d'urgences" />}
            )
        }} ></Stack.Screen>
    </Stack.Navigator>
  );
}
