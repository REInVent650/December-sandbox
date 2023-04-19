import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { MD3LightTheme as DefaultTheme, Card, Button, Provider as PaperProvider } from 'react-native-paper';
import { Accelerometer } from 'expo-sensors';
import firebase from 'firebase';
import { Firebase } from './config/firebase'
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00947E',
    secondary: '#444444'
  },
};

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  //this code doesn't get triggered 

  const now = Date.now();

  //console.log('Background fetch task started at: ${new Date(now).toISOString()}');
  console.log('test');
  return BackgroundFetch.BackgroundFetchResult.NewData;

});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 1 hour
    stopOnTerminate: false, // Android-only,
    staryOnBoot: true, // Android-only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function App() {

  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0, timestamp: 0 });
  const [subscription, setSubscription] = useState(null);
  const [database, setDatabase] = useState(null);
  const [user, setUser] = useState(null);

  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  Accelerometer.setUpdateInterval(1000);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }
    checkStatusAsync();
  };

  firebase.auth().signInAnonymously().then((userCredential) => {
    setUser(userCredential.user);

    const fbDatabase = firebase.database();
    setDatabase(fbDatabase);

    if (database) {
      database.ref("testDataDevice/" + user.uid).push({ osName: Device.osName, osVersion: Device.osVersion });
    }

  })
    .catch((ignored) => {
    });


  subscribeToAccelerometer = () => {
    setSubscription(Accelerometer.addListener((accelerometerData) => {
      let firebaseAccelermoterData = { x: accelerometerData.x, y: accelerometerData.y, z: accelerometerData.z, timestamp: Date.now() };
      setAccelerometerData(firebaseAccelermoterData);

      //if (database && (Math.floor(accelerometerData.x + accelerometerData.y + accelerometerData.z) > 0)) { //apply hurdle
      database.ref("testData/" + user.uid).push(accelerometerData);
      //}
    }));

  };

  unsubscribeFromAccelerometer = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };



  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text>
            Background fetch status:{' '}
            <Text style={styles.boldText}>
              {status && BackgroundFetch.BackgroundFetchStatus[status]}
            </Text>
          </Text>
          <Text>
            Background fetch task name:{' '}
            <Text style={styles.boldText}>
              {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
            </Text>
          </Text>
        </View>
        <View style={styles.card}>
          <Button
            title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
            onPress={toggleFetchTask}
          /></View>

        <Text style={styles.paragraph}>
          Use the button below to toggle accelerometer detection.
        </Text>

        <Button icon="cellphone" mode="contained" onPress={subscription ? unsubscribeFromAccelerometer : subscribeToAccelerometer}>
          {subscription ? "Disable Detection" : "Enable Detection"}
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
  card: {
    marginTop: 30,
    backgroundColor: "white"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
