import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { MD3LightTheme as DefaultTheme,Card, Button, Provider as PaperProvider } from 'react-native-paper';
import { Accelerometer } from 'expo-sensors';
import firebase from 'firebase';

const theme = {  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00947E',
    secondary: '#444444'
  },
};

const firebaseConfig = {
  apiKey: "AIzaSyDOnjC0vHckQhWhZOvMhrWvXRmTnSQY0Mc",
  authDomain: "december-sandbox.firebaseapp.com",
  databaseURL: "https://december-sandbox-default-rtdb.firebaseio.com",
  projectId: "december-sandbox",
  storageBucket: "december-sandbox.appspot.com",
  messagingSenderId: "775531210491",
  appId: "1:775531210491:web:fb15f28e7fb0a6545a325e",
  measurementId: "G-JFNDGTGBX3"
};


export default function App() {

  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [database, setDatabase] = useState(null);
  const [user, setUser] = useState(null);

  Accelerometer.setUpdateInterval(1000);

  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }


  firebase.auth().signInAnonymously().then((userCredential) => {
    setUser(userCredential.user);
    const fbDatabase = firebase.database();
    setDatabase(fbDatabase);
  })
  .catch((error) => {
  });


  subscribeToAccelerometer = () => {
    setSubscription(Accelerometer.addListener((accelerometerData) => {
      setAccelerometerData(accelerometerData);
      if (database){
        database.ref("testData/" + user.uid).push(accelerometerData);
      }
    }));

  };

  unsubscribeFromAccelerometer = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };



  return (
    <PaperProvider theme={theme}>
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Use the button below to toggle accelerometer detection.
      </Text>

      <Button icon="cellphone" mode="contained" onPress={ subscription ? unsubscribeFromAccelerometer : subscribeToAccelerometer }>
        { subscription ? "Disable Detection" : "Enable Detection" }
      </Button>

      <Card style={styles.card}>

          <Text style={styles.paragraph}>
            x = {accelerometerData.x.toFixed(2)}{', '}
            y = {accelerometerData.y.toFixed(2)}{', '}
            z = {accelerometerData.z.toFixed(2)}
          </Text>

      </Card>
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  card : {
    marginTop:30,
    backgroundColor:"white"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
