import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CarnetPersonnel from '../screens/carnetPersonnel';
import Header from '../Shared/header';
import AntecedentsMedicaux from '../screens/carnet_personnel/antecedentsMedicaux';
import Maladies from '../screens/carnet_personnel/maladies';
import Examens from '../screens/carnet_personnel/examens';
import Vaccins from '../screens/carnet_personnel/vaccins';
import RendezVous from '../screens/carnet_personnel/rendezVous';
import AntecedentsFamiliaux from '../screens/carnet_personnel/antecedentsFamiliaux';
import Regimes from '../screens/carnet_personnel/regimes';
import Medicaments from '../screens/carnet_personnel/medicaments';
import Allergies from '../screens/carnet_personnel/allergies';
import Corps from '../screens/carnet_personnel/corps';
import Habitudes from '../screens/carnet_personnel/habitudes';
import Chirurgies from '../screens/carnet_personnel/chirurgies';
import Ordonnances from '../screens/carnet_personnel/ordonnances';
import TestsL from '../screens/carnet_personnel/testsL';
import AntMedDetails from '../screens/carnet_personnel/details/antMedDetails';
import MaladiesDetails from '../screens/carnet_personnel/details/maladiesDetails';
import ExamensDetails from '../screens/carnet_personnel/details/examensDetails';
import VaccinsDetails from '../screens/carnet_personnel/details/vaccinsDetails';
import RendezVousDetails from '../screens/carnet_personnel/details/rendezVousDetails';
import AntecedentsFamiliauxDetails from '../screens/carnet_personnel/details/antecedentsFamiliauxDetails';
import RegimesDetails from '../screens/carnet_personnel/details/regimesDetails';
import MedicamentsDetails from '../screens/carnet_personnel/details/medicamentsDetails';
import AllergiesDetails from '../screens/carnet_personnel/details/allergiesDetails';
import CorpsDetails from '../screens/carnet_personnel/details/corpsDetails';
import HabitudesDetails from '../screens/carnet_personnel/details/habitudesDetails';
import ChirurgiesDetails from '../screens/carnet_personnel/details/chirurgiesDetails';
import OrdonnancesDetails from '../screens/carnet_personnel/details/ordonnancesDetails';
import TestsLDetails from '../screens/carnet_personnel/details/testsLDetails';

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
          <Stack.Screen name="CarnetPersonnel" component={ CarnetPersonnel } options={({navigation}) => { 
            return(
              {headerTitle: () => <Header navigation={navigation} title='Carnet Personnel' />}
            )
          }} ></Stack.Screen>
            <Stack.Screen name="AntecedentsMedicaux" component={ AntecedentsMedicaux } options={{title:"Antécédents médicaux"}} ></Stack.Screen>
            <Stack.Screen name="Maladies" component={ Maladies } options={{title:"Maladies"}} ></Stack.Screen>
            <Stack.Screen name="Examens" component={ Examens } options={{title:"Examens"}} ></Stack.Screen>
            <Stack.Screen name="Vaccins" component={ Vaccins } options={{title:"Vaccins"}} ></Stack.Screen>
            <Stack.Screen name="RendezVous" component={ RendezVous } options={{title:"Rendez-Vous"}} ></Stack.Screen>
            <Stack.Screen name="AntecedentsFamiliaux" component={ AntecedentsFamiliaux } options={{title:"Antécédents Familiaux"}} ></Stack.Screen>
            <Stack.Screen name="Regimes" component={ Regimes } options={{title:"Régimes"}} ></Stack.Screen>
            <Stack.Screen name="Medicaments" component={ Medicaments } options={{title:"Médicaments"}} ></Stack.Screen>
            <Stack.Screen name="Allergies" component={ Allergies } options={{title:"Allergies"}} ></Stack.Screen>
            <Stack.Screen name="Corps" component={ Corps } options={{title:"Poid et mesures du corps"}} ></Stack.Screen>
            <Stack.Screen name="Habitudes" component={ Habitudes } options={{title:"Habitudes alcoolo-tabagiques"}} ></Stack.Screen>
            <Stack.Screen name="Chirurgies" component={ Chirurgies } options={{title:"Chirurgies"}} ></Stack.Screen>
            <Stack.Screen name="Ordonnances" component={ Ordonnances } options={{title:"Ordonnances"}} ></Stack.Screen>
            <Stack.Screen name="TestsL" component={ TestsL } options={{title:"Tests de laboratoire"}} ></Stack.Screen>
            <Stack.Screen name="AntMedDetails" component={ AntMedDetails } options={{title:"Antécédents médicaux"}} ></Stack.Screen>
            <Stack.Screen name="MaladiesDetails" component={ MaladiesDetails } options={{title:"Maladies"}} ></Stack.Screen>
            <Stack.Screen name="ExamensDetails" component={ ExamensDetails } options={{title:"Examens"}} ></Stack.Screen>
            <Stack.Screen name="VaccinsDetails" component={ VaccinsDetails } options={{title:"Vaccins"}} ></Stack.Screen>
            <Stack.Screen name="RendezVousDetails" component={ RendezVousDetails } options={{title:"Rendez-Vous"}} ></Stack.Screen>
            <Stack.Screen name="AntecedentsFamiliauxDetails" component={ AntecedentsFamiliauxDetails } options={{title:"Antécédents Familiaux"}} ></Stack.Screen>
            <Stack.Screen name="RegimesDetails" component={ RegimesDetails } options={{title:"Régimes"}} ></Stack.Screen>
            <Stack.Screen name="MedicamentsDetails" component={ MedicamentsDetails } options={{title:"Médicaments"}} ></Stack.Screen>
            <Stack.Screen name="AllergiesDetails" component={ AllergiesDetails } options={{title:"Allergies"}} ></Stack.Screen>
            <Stack.Screen name="CorpsDetails" component={ CorpsDetails } options={{title:"Poid et mesures du corps"}} ></Stack.Screen>
            <Stack.Screen name="HabitudesDetails" component={ HabitudesDetails } options={{title:"Habitudes alcoolo-tabagiques"}} ></Stack.Screen>
            <Stack.Screen name="ChirurgiesDetails" component={ ChirurgiesDetails } options={{title:"Chirurgies"}} ></Stack.Screen>
            <Stack.Screen name="OrdonnancesDetails" component={ OrdonnancesDetails } options={{title:"Ordonnances"}} ></Stack.Screen>
            <Stack.Screen name="TestsLDetails" component={ TestsLDetails } options={{title:"Tests de laboratoire"}} ></Stack.Screen>
        </Stack.Navigator>
  );
}
