import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import Card from '../Shared/card';

export default function CarnetPersonnel({navigation}){
    
    return(
            <ScrollView>
            <View style={ globalStyles.container }>
                <TouchableOpacity onPress={() => navigation.navigate('AntecedentsMedicaux') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Antécédents médicaux</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Maladies') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Maladies</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Examens') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Examens</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Vaccins') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Vaccins</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('RendezVous') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Rendez-vous</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AntecedentsFamiliaux') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Antécédents familiaux</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Regimes') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Régimes</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Medicaments') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Médicaments</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Allergies') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Allergies</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Corps') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Poid et mesures du corps</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Habitudes') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Habitudes alcoolo-tabagiques</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Chirurgies') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Chirurgies</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Ordonnances') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Ordonnances</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('TestsL') }>
                    <Card>
                        <Text style={globalStyles.titleText}>Tests de laboratoire</Text>
                    </Card>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create ({
    modalContainer:{
        flex: 1,
    },
    modalToggle:{
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f2f2f3',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    modalClose: {
        marginBottom: 0,
        marginTop: 20,
    },
});