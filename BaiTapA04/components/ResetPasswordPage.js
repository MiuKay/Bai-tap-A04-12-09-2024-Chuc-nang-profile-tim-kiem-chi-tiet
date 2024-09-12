import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

export default function ResetPasswordPage({ route, navigation }) {
    const { email } = route.params; // Nhận email từ params
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = () => {
        // Kiểm tra sự khớp của mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            Alert.alert("Thông báo", "Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        fetch('http://172.16.20.219:3000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Thông báo", "Đặt lại mật khẩu thành công!", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Login"), // Điều hướng đến trang đăng nhập
                    },
                ]);
            } else {
                Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
            <Text style={styles.label}>Mật Khẩu Mới</Text>
            <TextInput 
                style={styles.input} 
                value={newPassword} 
                onChangeText={setNewPassword} 
                secureTextEntry
            />
            <Text style={styles.label}>Xác Nhận Mật Khẩu</Text>
            <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Đặt Lại Mật Khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
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
