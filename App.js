import React, {useState, useEffect} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';


// or any pure javascript modules available in npm
import { MD3LightTheme as DefaultTheme,Card, Button, Provider as PaperProvider } from 'react-native-paper';

import { Accelerometer } from 'expo-sensors';


const theme = {  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00947E',
    secondary: '#444444'
  },
};

export default function App() {

  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  subscribeToAccelerometer = () => {
    setSubscription(Accelerometer.addListener((accelerometerData) => {
      setAccelerometerData(accelerometerData);
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
