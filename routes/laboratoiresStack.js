import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../Shared/header';
import Laboratoires from '../screens/laboratoires';
import LaboratoiresDetails from '../screens/details/laboratoiresDetails';

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

        <Stack.Screen name="Laboratoires" component={ Laboratoires } options={({navigation}) => { 
            return(
                {headerTitle: () => <Header navigation={navigation} title="Laboratoires" />}
            )
        }} ></Stack.Screen>
        <Stack.Screen name="LaboratoiresDetails" component={ LaboratoiresDetails } options={{title:"Laboratoire"}} ></Stack.Screen>
    </Stack.Navigator>
  );
}
