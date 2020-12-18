import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Navigator from './routes/drawer';
import Navigator2 from './routes/drawer2';
import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyZHCIJ3EfKgFnWO3z2nMn7zm37K2Sj_E",
  authDomain: "my-new-project-b9f86.firebaseapp.com",
  databaseURL: "https://my-new-project-b9f86.firebaseio.com",
  projectId: "my-new-project-b9f86",
  storageBucket: "my-new-project-b9f86.appspot.com",
  messagingSenderId: "351480021024",
  appId: "1:351480021024:web:71e15496ab755acaf2bc45",
  measurementId: "G-Q1F9KM3NQV"
};
firebase.initializeApp(firebaseConfig);

const getFonts = () => Font.loadAsync({
    'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf')
  });
  
export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);


  if(fontsLoaded){
      return (
        <Navigator />
      );
  }else{
    return(
      <AppLoading
        startAsync={getFonts}
        onFinish={()=> setFontsLoaded(true)}
      />
    )
  }
}


