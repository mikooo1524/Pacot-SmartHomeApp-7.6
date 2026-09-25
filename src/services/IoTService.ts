import {
    Device,
    SensorData,
    sampleDevices,
} from '../models/IoTModels';

// Probability (0 to 1) that a simulated request fails.
// Set to 0 to disable failures, or 1 to always fail (useful for testing).
const FAILURE_RATE = 0.2;

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

const shouldFail = () => Math.random() < FAILURE_RATE;

const randomBetween = (min: number, max: number) =>
    Math.round(min + Math.random() * (max - min));

// Simulated backend storage (lives in memory, like a tiny fake IoT API)
let serverDevices: Device[] = sampleDevices.map((device) => ({
    ...device,
}));

export async function getSensorData(): Promise<SensorData> {
    await delay(1500);

    if (shouldFail()) {
        throw new Error('Unable to retrieve sensor data.');
    }

    return {
        temperature: randomBetween(24, 34),
        humidity: randomBetween(50, 80),
        lightLevel: randomBetween(300, 1000),
    };
}

export async function getDevices(): Promise<Device[]> {
    await delay(1200);

    if (shouldFail()) {
        throw new Error('Unable to retrieve devices.');
    }

    return serverDevices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {
    await delay(1000);

    const device = serverDevices.find((item) => item.id === id);

    if (!device) {
        throw new Error('Device not found.');
    }

    if (shouldFail()) {
        throw new Error(`Unable to update ${device.name}.`);
    }

    device.status = status;

    return { ...device };
}

export async function connectGateway(): Promise<void> {
    await delay(1000);
}
