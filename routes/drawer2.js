import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './homeStack';
import CarnetPersonnelStack from './carnetPersonnelStack';
import JoindreCompteStack from './joindreCompteStack';
import PharmaciesStack from './pharmaciesStack';
import MedecinsStack from './medecinsStack';
import ServicesUrgsStack from './servicesUrgsStack';
import HopitauxStack from './hopitauxStack';
import LaboratoiresStack from './laboratoiresStack';
import UserSignupStack  from './userSignupStack';
import UserLoginStack  from './userLoginStack';
import AppelUrgStack  from './appelUrgStack';
import { globalStyles, images } from '../styles/global';
import FavorisStack  from './favorisStack';
import { Image, Text } from 'react-native';
import appelUrgStack from './appelUrgStack';

const Drawer = createDrawerNavigator();

export default Navigator2 = () => {

  return(
      <NavigationContainer>
          <Drawer.Navigator initialRouteName='Home'>
          {/* {isSignIn == false ? (
              <>
                <Drawer.Screen name="UserLogin" component={ UserLoginStack } />
                <Drawer.Screen name="UserSignup" component={ UserSignupStack } />
              </>
                ) : (
                  <> */}
                    <Drawer.Screen name="Home" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Accueil</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['home']} />}} component={ HomeStack } />
                    <Drawer.Screen name="Carnet Personnel" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Carnet Personnel</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['carnt']} />}} component={ CarnetPersonnelStack } />
                    <Drawer.Screen name="Joindre Compte" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Joindre Compte</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['Jcomptes']} />}} component={ JoindreCompteStack } />
                    <Drawer.Screen name="Pharmacies" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Pharmacies</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['pharm']} />}} component={ PharmaciesStack } />
                    <Drawer.Screen name="Medecins" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Medecins</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['doc']} />}} component={ MedecinsStack } />
                    <Drawer.Screen name="Services d'urgence" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Services d'urgence</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['serv']} />}} component={ ServicesUrgsStack } />
                    <Drawer.Screen name="Hopitaux" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Hopitaux</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['hosp']} />}} component={ HopitauxStack } />
                    <Drawer.Screen name="Laboratoires" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Laboratoires</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['lab']} />}} component={ LaboratoiresStack } />
                    <Drawer.Screen name="Favoris" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Favoris</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['favo']} />}} component={ FavorisStack } />
                    <Drawer.Screen name="Appel d'urgences" options={{drawerLabel: () =><Text style={globalStyles.menuText}>Appel d'urgences</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['call']} />}} component={ AppelUrgStack } />
                    <Drawer.Screen name="UserLogin" component={ UserLoginStack } options={{ gestureEnabled: false, drawerLabel: () =><Text style={globalStyles.menuText}>Log Out</Text>, drawerIcon:()=> <Image style={globalStyles.menu} source={images.menu['logOut']} />}} />
          </Drawer.Navigator>
      </NavigationContainer>
  );
}