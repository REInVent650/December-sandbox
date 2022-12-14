import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { Accelerometer, DeviceMotion } from 'expo-sensors';
import { Card } from 'react-native-paper';

const Gs = 9.80665;

export default function App() {

  const hurdleX = 10;
  const hurdleY = 10;
  const [peakX, setPeakX] = useState(0);
  const peakY = 0;

  const [currentValueX, setCurrentValueX] = useState(0);
  const [xS, setXS] = useState([]);
  const [lastValueX, setLastValueX] = useState(0);
  const [motionX, setMotionX] = useState(false);
  const [intensityX, setIntensityX] = useState(0);
  const [peakIntensityX, setPeakIntensityX] = useState(0);

  const _increaseX = () => {
    if (currentValueX >= hurdleX) {
      setIntensityX(intensityX + 1);
    }
  };

  const _decreaseX = () => {};

  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

//accelerometer code
  const [subscription, setSubscription] = useState(null);

  const _slow = () => {
    Accelerometer.setUpdateInterval(2000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
        setLastValueX(currentValueX);
        setCurrentValueX(round(Math.abs(accelerometerData.x * Gs)));
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  });

  useEffect(() => {
    if (currentValueX > lastValueX){
      //setLastValueX(currentValueX);
      //setIntensityX(intensityX + 1);
      //setMotionX(true);
    } else {
      if (motionX == true){
        //setMotionX(false);
        //setLastValueX(0);
        //setIntensityX(0);
      }
//setMotionX(false);
    }
  }, [currentValueX, lastValueX, intensityX, motionX]);

  useEffect(() => {
        if (currentValueX > peakX) {
          setPeakX(currentValueX);
        }
  }, [peakX, currentValueX]);

  useEffect(() => {
      if (intensityX > peakIntensityX) {
        setPeakIntensityX(intensityX);
      }
  }, [intensityX, peakIntensityX]);


  const { x, y, z } = data;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Accelerometer: (in Gs where 1 G = 9.81 m s^-2)
      </Text>
      <Text style={styles.text}>
        x: {Math.round(x)} y: {Math.round(y)} z: {Math.floor(z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>

      <Card>
        <View style={styles.card}>
          <Text style={styles.paragraph}>Normalization X</Text>
          <Text>Last value: {lastValueX}</Text>
          <Text>Current value: {currentValueX}</Text>
                    <Text>Peak: {peakX}</Text>
                    <Text> = = = = = = = = = = </Text>
          <Text>Intensity: {intensityX}</Text>
          <Text>Intensity peaked at: {peakIntensityX}</Text>
        </View>
      </Card>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#008080',
  },
  card: {
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ffffff',
    padding: 8,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
