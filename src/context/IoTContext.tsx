import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    Device,
    SensorData,
    initialSensorData,
} from '../models/IoTModels';

import {
    getDevices,
    getSensorData,
    updateDeviceStatus,
    connectGateway as connectGatewayService,
} from '../services/IoTService';

type DeviceError = {
    deviceId: number;
    value: boolean;
    message: string;
};

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;

    gatewayConnected: boolean;
    gatewayConnecting: boolean;

    devicesLoading: boolean;
    sensorsLoading: boolean;
    updatingDeviceIds: number[];

    devicesError: string | null;
    sensorsError: string | null;
    deviceError: DeviceError | null;

    toggleDevice: (id: number, value: boolean) => Promise<void>;
    retryDeviceUpdate: () => Promise<void>;
    loadDevices: () => Promise<void>;
    refreshSensors: () => Promise<void>;
    disconnectGateway: () => void;
    connectGateway: () => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData>(
        initialSensorData
    );

    const [gatewayConnected, setGatewayConnected] = useState(true);
    const [gatewayConnecting, setGatewayConnecting] = useState(false);

    const [devicesLoading, setDevicesLoading] = useState(false);
    const [sensorsLoading, setSensorsLoading] = useState(false);
    const [updatingDeviceIds, setUpdatingDeviceIds] = useState<number[]>([]);

    const [devicesError, setDevicesError] = useState<string | null>(null);
    const [sensorsError, setSensorsError] = useState<string | null>(null);
    const [deviceError, setDeviceError] = useState<DeviceError | null>(null);

    // Internal fetchers (talk to the service)
    const fetchDevices = async () => {
        setDevicesLoading(true);
        setDevicesError(null);

        try {
            setDevices(await getDevices());
        } catch {
            setDevicesError('Unable to retrieve devices.');
        } finally {
            setDevicesLoading(false);
        }
    };

    const fetchSensors = async () => {
        setSensorsLoading(true);
        setSensorsError(null);

        try {
            setSensors(await getSensorData());
        } catch {
            setSensorsError('Unable to retrieve sensor data.');
        } finally {
            setSensorsLoading(false);
        }
    };

    // Load initial data once
    useEffect(() => {
        fetchDevices();
        fetchSensors();
    }, []);

    // Public actions (blocked while gateway is disconnected)
    const loadDevices = async () => {
        if (!gatewayConnected) return;
        await fetchDevices();
    };

    const refreshSensors = async () => {
        if (!gatewayConnected || sensorsLoading) return;
        await fetchSensors();
    };

    const toggleDevice = async (id: number, value: boolean) => {
        if (!gatewayConnected) return;

        const target = devices.find((device) => device.id === id);
        if (!target) return;

        const previous = target.status;

        setDeviceError(null);

        // Update the UI immediately
        setDevices((current) =>
            current.map((device) =>
                device.id === id ? { ...device, status: value } : device
            )
        );

        setUpdatingDeviceIds((current) => [...current, id]);

        try {
            await updateDeviceStatus(id, value);
        } catch {
            // Roll back and report the failure
            setDevices((current) =>
                current.map((device) =>
                    device.id === id
                        ? { ...device, status: previous }
                        : device
                )
            );

            setDeviceError({
                deviceId: id,
                value,
                message: `Unable to update ${target.name}.`,
            });
        } finally {
            setUpdatingDeviceIds((current) =>
                current.filter((deviceId) => deviceId !== id)
            );
        }
    };

    const retryDeviceUpdate = async () => {
        if (!deviceError) return;
        await toggleDevice(deviceError.deviceId, deviceError.value);
    };

    const disconnectGateway = () => {
        setGatewayConnected(false);
    };

    const connectGateway = async () => {
        if (gatewayConnecting) return;

        setGatewayConnecting(true);

        try {
            await connectGatewayService();
            setGatewayConnected(true);
            setDeviceError(null);
            await Promise.all([fetchDevices(), fetchSensors()]);
        } finally {
            setGatewayConnecting(false);
        }
    };

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                gatewayConnected,
                gatewayConnecting,
                devicesLoading,
                sensorsLoading,
                updatingDeviceIds,
                devicesError,
                sensorsError,
                deviceError,
                toggleDevice,
                retryDeviceUpdate,
                loadDevices,
                refreshSensors,
                disconnectGateway,
                connectGateway,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}
