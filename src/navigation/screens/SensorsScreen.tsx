import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import ErrorBanner from '../../components/ErrorBanner';

export default function SensorsScreen() {

  const {
    sensors,
    sensorsLoading,
    sensorsError,
    gatewayConnected,
    gatewayConnecting,
    refreshSensors,
    connectGateway,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {!gatewayConnected && (
        <ErrorBanner
          message="IoT Gateway is disconnected."
          onRetry={connectGateway}
          retryDisabled={gatewayConnecting}
        />
      )}

      {sensorsError && gatewayConnected && (
        <ErrorBanner
          message={sensorsError}
          onRetry={refreshSensors}
          retryDisabled={sensorsLoading}
        />
      )}

      {sensorsLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>
            Refreshing Sensors...
          </Text>
        </View>
      )}

      {/* Temperature */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="thermometer-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Temperature
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.temperature} °C
        </Text>

        <Text style={styles.sensorDescription}>
          Current room temperature
        </Text>

      </View>

      {/* Humidity */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="water-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Humidity
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.humidity} %
        </Text>

        <Text style={styles.sensorDescription}>
          Current relative humidity
        </Text>

      </View>

      {/* Light Level */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="sunny-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Light Level
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors.lightLevel} lux
        </Text>

        <Text style={styles.sensorDescription}>
          Current ambient light
        </Text>

      </View>

      {/* Refresh */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          (sensorsLoading || !gatewayConnected) && styles.refreshDisabled,
        ]}
        onPress={refreshSensors}
        disabled={sensorsLoading || !gatewayConnected}
      >
        {sensorsLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Ionicons
            name="refresh-outline"
            size={20}
            color="#ffffff"
          />
        )}

        <Text style={styles.refreshText}>
          {sensorsLoading ? 'Refreshing...' : 'Refresh Sensors'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },

  loadingText: {
    fontSize: 14,
  },

  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    marginBottom: 30,
  },

  refreshDisabled: {
    opacity: 0.5,
  },

  refreshText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});