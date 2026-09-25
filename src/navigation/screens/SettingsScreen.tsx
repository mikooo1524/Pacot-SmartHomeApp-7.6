import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function SettingsScreen() {

  const [notifications, setNotifications] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const {
    gatewayConnected,
    gatewayConnecting,
    connectGateway,
    disconnectGateway,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      {/* Header */}

      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.subtitle}>
        Configure your IoT application
      </Text>


      {/* General Settings */}

      <Text style={styles.sectionTitle}>
        General
      </Text>


      {/* Notifications */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="notifications-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Notifications
            </Text>

            <Text style={styles.settingDescription}>
              Receive alerts from your IoT devices
            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>


      {/* Auto Connect */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="wifi-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Auto Connect
            </Text>

            <Text style={styles.settingDescription}>
              Automatically connect to the IoT gateway
            </Text>

          </View>

        </View>

        <Switch
          value={autoConnect}
          onValueChange={setAutoConnect}
        />

      </View>


      {/* Dark Mode */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="moon-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Dark Mode
            </Text>

            <Text style={styles.settingDescription}>
              Use a darker application appearance
            </Text>

          </View>

        </View>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />

      </View>


      {/* Connection */}

      <Text style={styles.sectionTitle}>
        Connection
      </Text>


      <View style={styles.connectionCard}>

        <View style={styles.connectionInfo}>

          <Ionicons
            name={gatewayConnected
              ? 'cloud-done-outline'
              : 'cloud-offline-outline'}
            size={30}
          />

          <View>

            <Text style={styles.connectionTitle}>
              IoT Gateway
            </Text>

            <Text style={styles.connectionStatus}>
              {gatewayConnecting
                ? 'Connecting...'
                : gatewayConnected
                  ? 'Connected'
                  : 'IoT Gateway is disconnected.'}
            </Text>

          </View>

        </View>

        <TouchableOpacity
          style={[
            styles.connectionButton,
            gatewayConnecting && styles.connectionButtonDisabled,
          ]}
          disabled={gatewayConnecting}
          onPress={gatewayConnected ? disconnectGateway : connectGateway}
        >
          <Text style={styles.connectionButtonText}>
            {gatewayConnected ? 'Disconnect' : 'Retry'}
          </Text>
        </TouchableOpacity>

      </View>

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 12,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingText: {
    marginLeft: 15,
    flex: 1,
  },

  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  connectionCard: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
  },

  connectionButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },

  connectionButtonDisabled: {
    opacity: 0.5,
  },

  connectionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  connectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  connectionStatus: {
    fontSize: 13,
    marginLeft: 15,
    marginTop: 3,
  },

});