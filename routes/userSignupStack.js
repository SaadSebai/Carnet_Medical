import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FirstHeader from '../Shared/firstHeader';
import UserSignup from '../screens/userSignup';

const Stack = createStackNavigator();

export default Navigator = () => {
  return (
        <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#ffad99',
          height: 80,
        },
        headerTintColor: '#333',
      }}>
          <Stack.Screen name="UserSignup" component={ UserSignup } options={({navigation}) => { 
            return(
              {headerTitle: () => <FirstHeader navigation={navigation} title='UserSignup' />}
            )
          }} ></Stack.Screen>
        </Stack.Navigator>
  );
}