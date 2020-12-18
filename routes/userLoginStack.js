import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserLogin from '../screens/userLogin';
import FirstHeader from '../Shared/firstHeader';
import UserSignup from '../screens/userSignup';
import LoadingLogin from '../screens/loadingLogin';

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
          <Stack.Screen name="UserLogin" component={ UserLogin } options={({navigation}) => { 
            return(
              {headerTitle: () => <FirstHeader navigation={navigation} title='Login' />}
            )
          }} ></Stack.Screen>
          <Stack.Screen name="UserSignup" component={ UserSignup } options={{title:"Sign Up"}} ></Stack.Screen>
          <Stack.Screen name="LoadingLogin" component={ LoadingLogin } options={{title:"Home"}} ></Stack.Screen>
        </Stack.Navigator>
  );
}