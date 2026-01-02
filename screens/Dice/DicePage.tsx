import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Dice3D from '../../components/Dice3D';
import CustomFacesModal from './CustomFacesModal';
import { Accelerometer } from 'expo-sensors';

// Conditionally import expo-av only for native platforms
let Audio: any = null;
if (Platform.OS !== 'web') {
  try {
    Audio = require('expo-av').Audio;
  } catch (e) {
    console.log('expo-av not available');
  }
}

// Declare window for web platform
declare const window: any;

export default function DicePage() {
  const [isRolling, setIsRolling] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customFaceValues, setCustomFaceValues] = useState<string[]>([]);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0});
  const audioRef = useRef<any>(null);
  const soundRef = useRef<any>(null);
  const SHAKE_THRESHOLD = 1.5;

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Pre-load audio on web
      try {
        // Check if we're actually in a browser environment
        if (typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
          const audioElement = new window.Audio();
          audioElement.src = require('../../assets/dice-roll.mp3');
          audioElement.volume = 0.5;
          audioElement.load();
          audioRef.current = audioElement;
          console.log('✅ Web audio loaded');
        }
      } catch (e) {
        console.error('❌ Web audio load failed:', e);
      }
    } else if (Audio) {
      setupAudio();
    }
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let subscription;
    subscription = Accelerometer.addListener((accData ) => setAccelerometerData(accData));

    if(subscription){
      subscription.remove();
    }
  }, []);

  useEffect(() => {
    const totalForce = Math.abs(accelerometerData.x) + Math.abs(accelerometerData.y) + Math.abs(accelerometerData.z);
    if(totalForce > SHAKE_THRESHOLD){
      // Do nothing if already shaking or rolling 
      if(isRolling) return;

      // Roll the dice on shake
      handleRoll();
    }
  }, [accelerometerData]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      console.log('Audio setup skipped');
    }
  };

  const playSound = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web: Use HTML Audio
        console.log('🔊 Playing web audio...');
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          console.log('✅ Web audio playing');
        } else {
          console.error('❌ Audio ref not initialized');
        }
      } else if (Audio) {
        // Native (iOS/Android): Use expo-av
        console.log('🔊 Playing native audio...');
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/dice-roll.mp3'),
            { shouldPlay: true, volume: 0.5 }
          );
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
          console.log('✅ Native audio playing');
        } catch (e) {
          console.log('⚠️ Native audio skipped (works in production build):', e);
        }
      }
    } catch (e) {
      console.error('❌ Sound error:', e);
    }
  };

  const handleRoll = () => {
    if (!isRolling) {
      setCurrentNumber(0);
      setIsRolling(true);
      playSound();
    }
  };

  const handleRollComplete = (result: number) => {
    setIsRolling(false);
    setCurrentNumber(result);
  };

  const handleCustomFacesSave = (faceValues: string[]) => {
    setCustomFaceValues(faceValues);
  };

  const hasCustomValues = customFaceValues.length === 6 && customFaceValues.every(val => val.trim() !== '');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>The Dice</Text>
        <Text style={styles.subtitle}>Drag to rotate • Tap button to roll</Text>
        
        <TouchableOpacity 
          style={styles.customButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.customButtonText}>⚙️ Custom Faces</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.diceContainer}>
        <Dice3D 
          isRolling={isRolling} 
          onRollComplete={handleRollComplete}
          customFaceValues={hasCustomValues ? customFaceValues : undefined}
        />
      </View>

      <View style={styles.resultContainer}>
        {/* <Text style={styles.resultLabel}>Result</Text> */}
        <Text style={styles.resultNumber}>
          {currentNumber ? (hasCustomValues ? customFaceValues[currentNumber - 1] : currentNumber) : '...'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
        onPress={handleRoll}
        disabled={isRolling}
        activeOpacity={0.8}
      >
        <Text style={styles.rollButtonText}>
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.instructions}>
        {isRolling ? 'Watch the dice roll!' : 'Use your finger to spin the dice'}
      </Text>

      <CustomFacesModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleCustomFacesSave}
        initialValues={customFaceValues}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 12,
  },
  customButton: {
    backgroundColor: '#3a3a4e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  customButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  diceContainer: {
    width: '100%',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: '#a0a0b0',
    marginBottom: 8,
  },
  resultNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#DC2626',
    textShadowColor: 'rgba(220, 38, 38, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  rollButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  rollButtonDisabled: {
    backgroundColor: '#7a1515',
    opacity: 0.7,
  },
  rollButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 12,
    color: '#606070',
    marginTop: 16,
  },
});

