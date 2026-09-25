import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import ErrorBanner from '../../components/ErrorBanner';

export default function DevicesScreen() {

  const {
    devices,
    devicesLoading,
    devicesError,
    deviceError,
    updatingDeviceIds,
    gatewayConnected,
    gatewayConnecting,
    toggleDevice,
    retryDeviceUpdate,
    loadDevices,
    connectGateway,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnected && (
        <ErrorBanner
          message="IoT Gateway is disconnected."
          onRetry={connectGateway}
          retryDisabled={gatewayConnecting}
        />
      )}

      {devicesError && gatewayConnected && (
        <ErrorBanner
          message={devicesError}
          onRetry={loadDevices}
          retryDisabled={devicesLoading}
        />
      )}

      {deviceError && gatewayConnected && (
        <ErrorBanner
          message={deviceError.message}
          onRetry={retryDeviceUpdate}
        />
      )}

      {devicesLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>
            Loading devices...
          </Text>
        </View>
      )}

      {devices.map((device) => {

        const updating = updatingDeviceIds.includes(device.id);

        return (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
              />

            </View>

            <View style={styles.deviceDetails}>

              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text style={styles.deviceState}>
                {updating
                  ? 'Updating...'
                  : device.status ? 'ON' : 'OFF'}
              </Text>

            </View>

          </View>

          <Switch
            value={device.status}
            disabled={!gatewayConnected || updating}
            onValueChange={(value) => {
              toggleDevice(device.id, value);
            }}
          />

        </View>

        );
      })}

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

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
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

});