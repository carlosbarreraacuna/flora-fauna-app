import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
  Text,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { useColorScheme } from '../../hooks/useColorScheme';
import { demoDataService } from '../../services/demoDataService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, logout, isDemoMode } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalSpecies: 0,
    floraCount: 0,
    faunaCount: 0,
    reportsCount: 0,
    conservationStatus: {
      critical: 0,
      endangered: 0,
      vulnerable: 0,
      stable: 0
    }
  });
  
  useEffect(() => {
    loadDashboardData();
  }, [isDemoMode]);
  
  const loadDashboardData = async () => {
    try {
      if (isDemoMode) {
        const metrics = await demoDataService.getDashboardMetrics();
        setDashboardMetrics(metrics);
      } else {
        // TODO: Load from API when not in demo mode
        // const metrics = await ApiService.getDashboardMetrics();
        // setDashboardMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
    setMenuVisible(false);
  };

  const handleProfile = () => {
    setMenuVisible(false);
    Alert.alert('Perfil', 'Funcionalidad de perfil en desarrollo');
  };

  const handleChangePassword = () => {
    setMenuVisible(false);
    Alert.alert('Cambiar Contraseña', 'Funcionalidad de cambio de contraseña en desarrollo');
  };

  const MetricCard = ({ title, value, icon, color, subtitle }: any) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.metricInfo}>
          <Text style={styles.metricValue}>{value}</Text>
          <Text style={styles.metricTitle}>{title}</Text>
          {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const QuickActionCard = ({ title, icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <LinearGradient
        colors={[color, color + 'CC']}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={32} color="white" />
        <Text style={styles.actionTitle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1B5E20', '#2E7D32']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuVisible(true)}
            >
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Flora & Fauna</Text>
              <Text style={styles.headerSubtitle}>Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>¡Hola, {user?.name}!</Text>
          <Text style={styles.welcomeSubtext}>Bienvenido al sistema de gestión</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Generales</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Especies Registradas"
              value={dashboardMetrics.totalSpecies.toLocaleString()}
              icon="leaf-outline"
              color="#4CAF50"
              subtitle={`Flora: ${dashboardMetrics.floraCount} | Fauna: ${dashboardMetrics.faunaCount}`}
            />
            <MetricCard
              title="Reportes Activos"
              value={dashboardMetrics.reportsCount.toString()}
              icon="document-text-outline"
              color="#2196F3"
              subtitle={isDemoMode ? "Datos demo" : "Pendientes"}
            />
            <MetricCard
              title="Estado Crítico"
              value={dashboardMetrics.conservationStatus.critical.toString()}
              icon="warning-outline"
              color="#F44336"
              subtitle="Especies en peligro"
            />
            <MetricCard
              title="Investigadores"
              value="34"
              icon="people-outline"
              color="#9C27B0"
              subtitle="Activos"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="Registrar Especie"
              icon="add-circle-outline"
              color="#4CAF50"
              onPress={() => Alert.alert('Registrar', 'Funcionalidad en desarrollo')}
            />
            <QuickActionCard
              title="Crear Reporte"
              icon="document-outline"
              color="#2196F3"
              onPress={() => Alert.alert('Reporte', 'Funcionalidad en desarrollo')}
            />
            <QuickActionCard
              title="Ver Mapa"
              icon="map-outline"
              color="#FF9800"
              onPress={() => Alert.alert('Mapa', 'Funcionalidad en desarrollo')}
            />
            <QuickActionCard
              title="Estadísticas"
              icon="bar-chart-outline"
              color="#9C27B0"
              onPress={() => Alert.alert('Estadísticas', 'Funcionalidad en desarrollo')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="leaf" size={16} color="white" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nueva especie registrada</Text>
                <Text style={styles.activityTime}>Hace 2 horas</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="document" size={16} color="white" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Reporte actualizado</Text>
                <Text style={styles.activityTime}>Hace 4 horas</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="location" size={16} color="white" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Área protegida añadida</Text>
                <Text style={styles.activityTime}>Ayer</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={32} color="#2E7D32" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
                <Ionicons name="person-outline" size={24} color="#2E7D32" />
                <Text style={styles.menuItemText}>Mi Perfil</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
                <Ionicons name="lock-closed-outline" size={24} color="#2E7D32" />
                <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
                <Text style={[styles.menuItemText, { color: '#d32f2f' }]}>Cerrar Sesión</Text>
                <Ionicons name="chevron-forward" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...TextStyles.navTitle,
    color: 'white',
  },
  headerSubtitle: {
    ...TextStyles.navSubtitle,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    ...TextStyles.h4,
    color: Colors.primary[800],
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: (width - 50) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  metricInfo: {
    flex: 1,
  },
  metricValue: {
    ...TextStyles.h2,
    color: Colors.text.primary,
  },
  metricTitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    height: 120,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  actionTitle: {
    ...TextStyles.label,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...TextStyles.cardTitle,
    color: Colors.text.primary,
  },
  activityTime: {
    ...TextStyles.caption,
    color: Colors.text.hint,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuItemText: {
    ...TextStyles.bodyLarge,
    flex: 1,
    color: Colors.text.primary,
    marginLeft: 15,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
