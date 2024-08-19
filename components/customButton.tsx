import React from "react";
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
    title: string;
    func: () => void;
}

export default function CustomButton({title, func}: CustomButtonProps) {
    return(
        <TouchableOpacity onPress={func} style={styles.Button}>
            <Text style={styles.ButtonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    Button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    ButtonText: {
        color: '#fff',
        fontSize: 16,
    }
})