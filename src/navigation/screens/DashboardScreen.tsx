import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import ErrorBanner from '../../components/ErrorBanner';



export default function DashboardScreen() {
    const {
        devices,
        sensors,
        devicesLoading,
        sensorsLoading,
        devicesError,
        sensorsError,
        deviceError,
        updatingDeviceIds,
        gatewayConnected,
        gatewayConnecting,
        toggleDevice,
        retryDeviceUpdate,
        loadDevices,
        refreshSensors,
        connectGateway,
    } = useIoT();

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
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
                <Text style={styles.status}>
                    Refreshing Sensors...
                </Text>
            )}

            <View style={styles.sensorRow}>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="thermometer-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Temperature
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.temperature}°C
                    </Text>
                </View>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Humidity
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.humidity}%
                    </Text>
                </View>

            </View>

            <Text style={styles.sectionTitle}>
                Device Status
            </Text>

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
                    <Text style={styles.status}>
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

                        <Ionicons
                            name={device.icon}
                            size={28}
                            style={styles.deviceIcon}
                        />

                        <View>
                            <Text style={styles.deviceName}>
                                {device.name}
                            </Text>

                            <Text style={styles.deviceType}>
                                <Text style={styles.deviceState}>
                                    {updating
                                        ? 'Updating...'
                                        : device.status ? 'ON' : 'OFF'}
                                </Text>
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

    greeting: {
        fontSize: 14,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },

    sensorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },

    sensorCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    sensorLabel: {
        fontSize: 14,
    },

    sensorValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
    },

    deviceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
        marginBottom: 12,
    },

    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deviceIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    deviceState: {
    },

    loading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },

    status: {
        fontSize: 14,
        marginTop: 15,
    },


});