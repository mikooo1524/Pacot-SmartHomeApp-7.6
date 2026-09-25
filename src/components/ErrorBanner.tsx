import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type Props = {
    message: string;
    onRetry?: () => void;
    retryDisabled?: boolean;
};

export default function ErrorBanner({
    message,
    onRetry,
    retryDisabled,
}: Props) {
    return (
        <View style={styles.banner}>

            <Ionicons
                name="alert-circle-outline"
                size={22}
                color="#b3261e"
            />

            <Text style={styles.message}>
                {message}
            </Text>

            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    disabled={retryDisabled}
                    style={[
                        styles.retryButton,
                        retryDisabled && styles.retryDisabled,
                    ]}
                >
                    <Text style={styles.retryText}>
                        Retry
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#fdecea',
        marginBottom: 15,
    },

    message: {
        flex: 1,
        fontSize: 14,
        color: '#b3261e',
    },

    retryButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#b3261e',
    },

    retryDisabled: {
        opacity: 0.5,
    },

    retryText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },

});
