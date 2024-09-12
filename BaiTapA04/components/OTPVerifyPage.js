import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

export default function OTPVerifyPage({ route, navigation }) {
    const { email } = route.params; // Nhận email từ params
    const [otpCode, setOtpCode] = useState("");

    const handleVerifyOTP = () => {
        fetch('http://172.16.20.219:3000/api/auth/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otpCode }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Thông báo", "Mã OTP xác nhận thành công!");
                navigation.navigate("ResetPassword", { email }); // Điều hướng đến trang ResetPassword
            } else {
                Alert.alert("Thông báo", "Mã OTP không hợp lệ hoặc đã hết hạn.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác Nhận Mã OTP</Text>
            <Text style={styles.label}>Mã OTP</Text>
            <TextInput 
                style={styles.input} 
                value={otpCode} 
                onChangeText={setOtpCode} 
                keyboardType="numeric"
                maxLength={6} // Giới hạn độ dài của mã OTP
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Xác Nhận OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Quay về</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        textAlign: 'center',
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    backButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    backButtonText: {
        color: "#2196F3",
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
