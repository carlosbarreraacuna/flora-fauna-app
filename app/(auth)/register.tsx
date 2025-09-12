import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(name, email, password, confirmPassword);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.overlay}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="leaf" size={60} color="#2E7D32" />
                <Text style={styles.appName}>Flora & Fauna</Text>
                <Text style={styles.subtitle}>Únete a la Conservación</Text>
              </View>
            </View>

            {/* Register Form */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Text style={styles.welcomeText}>Crear Cuenta</Text>
                <Text style={styles.registerText}>Regístrate para comenzar</Text>
                
                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
                
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                
                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña (mín. 6 caracteres)"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Register Button */}
                <TouchableOpacity 
                  style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                      <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>
                
                {/* Terms and Conditions */}
                <Text style={styles.termsText}>
                  Al registrarte, aceptas nuestros{' '}
                  <Text style={styles.termsLink}>Términos y Condiciones</Text>
                  {' '}y{' '}
                  <Text style={styles.termsLink}>Política de Privacidad</Text>
                </Text>
                
                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                {/* Login Link */}
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.loginButtonText}>Ya tengo una cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2024 Flora & Fauna Colombia</Text>
              <Text style={styles.footerSubtext}>Protegiendo nuestra biodiversidad</Text>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    ...TextStyles.h1,
    color: '#2E7D32',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  registerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...TextStyles.inputText,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 15,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    ...TextStyles.button,
    color: 'white',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  termsText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 15,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    ...TextStyles.button,
    color: Colors.primary[700],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
});