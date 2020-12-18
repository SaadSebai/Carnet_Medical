import { StyleSheet } from 'react-native';


export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    titleText: {
        fontFamily: 'nunito-bold',
        fontSize: 18,
        color: '#333'
    },
    bodyText: {
        fontFamily: 'sans-serif',
        fontSize: 18,
        color: '#333'
    },
    paragreph: {
        marginVertical: 8,
        lineHeight: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 19,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
    },
    errorText: {
        color: 'crimson',
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 6,
        textAlign: 'center',
    },
    like: {
        marginTop: 4,
        width:40,
        height:40,
        marginRight: 4,
    },
    menu: {
        width:40,
        height:40,
    },
    menuText:{
        fontSize: 15,
    },
});

export const images = {
    ratings: {
        '1': require('../assets/rating-1.png'),
        '2': require('../assets/rating-2.png'),
        '3': require('../assets/rating-3.png'),
        '4': require('../assets/rating-4.png'),
        '5': require('../assets/rating-5.png'),
    },
    likes: {
        '0': require('../assets/blackheart.png'),
        '1': require('../assets/liked.png'),
    },
    menu: {
        'home': require('../assets/home.png'),
        'carnt': require('../assets/carnt.png'),
        'Jcomptes': require('../assets/Jcomptes.png'),
        'pharm': require('../assets/pharm.png'),
        'doc': require('../assets/doc.png'),
        'serv': require('../assets/serv.png'),
        'hosp': require('../assets/hosp.jpg'),
        'lab': require('../assets/lab.png'),
        'favo': require('../assets/favo.png'),
        'call': require('../assets/call.png'),
        'logOut': require('../assets/logOut.png'),
        'mapIcon': require('../assets/mapIcon.png'),
        'vaccine': require('../assets/vaccine.png'),
        'rendez': require('../assets/rendez.png'),
        'testlab': require('../assets/testlab.png'),
    },
};