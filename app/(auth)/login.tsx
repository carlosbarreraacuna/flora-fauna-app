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
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const { login, isDemoMode, toggleDemoMode, getDemoUsers } = useAuth();
  
  const demoUsers = getDemoUsers();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.message) {
        Alert.alert('¡Éxito!', result.message, [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      Alert.alert('Error de autenticación', result.error || 'Credenciales inválidas');
    }
  };

  const fillDemoCredentials = (user: any) => {
    setEmail(user.email);
    setPassword(user.password);
    setShowDemoInfo(false);
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
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
                <Text style={styles.subtitle}>Conservación de la Biodiversidad</Text>
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Text style={styles.welcomeText}>Bienvenido</Text>
                <Text style={styles.loginText}>Inicia sesión en tu cuenta</Text>
                
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
                    placeholder="Contraseña"
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
                
                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                
                {/* Login Button */}
                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>
                
                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                {/* Register Link */}
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={() => router.push('/(auth)/register')}
                >
                  <Text style={styles.registerButtonText}>Crear nueva cuenta</Text>
                </TouchableOpacity>
                
                {/* Demo Mode Section */}
                <View style={styles.demoSection}>
                  <View style={styles.demoHeader}>
                    <Ionicons 
                      name={isDemoMode ? "play-circle" : "cloud-outline"} 
                      size={16} 
                      color={isDemoMode ? Colors.primary[600] : Colors.text.hint} 
                    />
                    <Text style={styles.demoModeText}>
                      Modo: {isDemoMode ? 'Demo (Sin conexión)' : 'API (Requiere conexión)'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.toggleModeButton}
                    onPress={toggleDemoMode}
                  >
                    <Text style={styles.toggleModeText}>
                      Cambiar a modo {isDemoMode ? 'API' : 'Demo'}
                    </Text>
                  </TouchableOpacity>
                  
                  {isDemoMode && (
                    <TouchableOpacity 
                      style={styles.demoInfoButton}
                      onPress={() => setShowDemoInfo(true)}
                    >
                      <Ionicons name="information-circle-outline" size={16} color={Colors.primary[600]} />
                      <Text style={styles.demoInfoText}>Ver usuarios demo</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
      
      {/* Demo Users Modal */}
      <Modal
        visible={showDemoInfo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDemoInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Usuarios Demo Disponibles</Text>
              <TouchableOpacity 
                onPress={() => setShowDemoInfo(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalDescription}>
                Selecciona un usuario demo para llenar automáticamente las credenciales:
              </Text>
              
              {demoUsers.map((user, index) => (
                <TouchableOpacity 
                  key={user.id}
                  style={styles.demoUserCard}
                  onPress={() => fillDemoCredentials(user)}
                >
                  <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                        <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
                      </View>
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userPassword}>Contraseña: {user.password}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.hint} />
                </TouchableOpacity>
              ))}
              
              <View style={styles.modalFooter}>
                <Text style={styles.modalFooterText}>
                  💡 Estos usuarios contienen datos de muestra para explorar la aplicación sin conexión a internet.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
  
  function getRoleColor(role: string) {
    switch (role) {
      case 'admin': return Colors.status.error;
      case 'researcher': return Colors.primary[600];
      case 'volunteer': return Colors.secondary[600];
      default: return Colors.text.hint;
    }
  }
  
  function getRoleLabel(role: string) {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'researcher': return 'Investigador';
      case 'volunteer': return 'Voluntario';
      default: return role;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    ...TextStyles.h1,
    color: 'white',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2E7D32',
  },
  loginText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
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
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    ...TextStyles.bodySmall,
    color: Colors.primary[700],
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  loginButtonText: {
    ...TextStyles.button,
    color: 'white',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    ...TextStyles.bodySmall,
    marginHorizontal: 15,
    color: Colors.text.secondary,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    ...TextStyles.button,
    color: Colors.primary[700],
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  footerSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  // Demo Mode Styles
  demoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoModeText: {
    ...TextStyles.bodySmall,
    color: 'rgba(0, 0, 0, 0.9)',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
  toggleModeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  toggleModeText: {
    ...TextStyles.bodySmall,
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
  },
  demoInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  demoInfoText: {
    ...TextStyles.bodySmall,
    color: 'rgba(0, 0, 0, 0.9)',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[300],
  },
  modalTitle: {
    ...TextStyles.h3,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  modalDescription: {
    ...TextStyles.body,
    color: Colors.text.secondary,
    marginVertical: 15,
    textAlign: 'center',
  },
  demoUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    ...TextStyles.caption,
    color: 'white',
    fontWeight: '500',
  },
  userEmail: {
    ...TextStyles.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  userPassword: {
    ...TextStyles.bodySmall,
    color: Colors.text.hint,
    fontFamily: 'monospace',
  },
  modalFooter: {
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 10,
  },
  modalFooterText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});