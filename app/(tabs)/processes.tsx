import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { demoDataService } from '../../services/demoDataService';
import { ProcessComplete, ProcessFilters, ProcessStats } from '../../types/processes';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import FloraProcessForm from '../../components/forms/FloraProcessForm';
import FaunaProcessForm from '../../components/forms/FaunaProcessForm';

const ProcessesScreen = () => {
  const [processes, setProcesses] = useState<ProcessComplete[]>([]);
  const [stats, setStats] = useState<ProcessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flora' | 'fauna'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessComplete | null>(null);
  const [showProcessDetail, setShowProcessDetail] = useState(false);
  const [floraFormVisible, setFloraFormVisible] = useState(false);
  const [faunaFormVisible, setFaunaFormVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [processesData, statsData] = await Promise.all([
        demoDataService.getProcesses(),
        demoDataService.getProcessStats()
      ]);
      setProcesses(processesData);
      setStats(statsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los procesos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleProcessCreated = (newProcess: ProcessComplete) => {
    setProcesses(prev => [newProcess, ...prev]);
    loadData();
  };

  const applyFilter = async (filter: 'all' | 'flora' | 'fauna') => {
    setSelectedFilter(filter);
    try {
      let filteredProcesses;
      if (filter === 'all') {
        filteredProcesses = await demoDataService.getProcesses();
      } else {
        filteredProcesses = await demoDataService.getProcessesByType(filter);
      }
      setProcesses(filteredProcesses);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron filtrar los procesos');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'iniciado':
        return Colors.status.info;
      case 'pendiente_recogida':
        return Colors.status.warning;
      case 'custodia_temporal':
        return Colors.status.warning;
      case 'proceso_legal':
        return Colors.status.error;
      case 'cerrado_liberado':
        return Colors.status.success;
      case 'cerrado_disposicion_final':
        return Colors.neutral[500];
      default:
        return Colors.neutral[400];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'iniciado':
        return 'Iniciado';
      case 'pendiente_recogida':
        return 'Pendiente Recogida';
      case 'custodia_temporal':
        return 'Custodia Temporal';
      case 'proceso_legal':
        return 'Proceso Legal';
      case 'cerrado_liberado':
        return 'Liberado';
      case 'cerrado_disposicion_final':
        return 'Disposición Final';
      default:
        return status;
    }
  };

  const getActivityText = (activity: string) => {
    switch (activity) {
      case 'incautacion':
        return 'Incautación';
      case 'entrega_voluntaria':
        return 'Entrega Voluntaria';
      case 'restitucion':
        return 'Restitución';
      default:
        return activity;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openProcessDetail = (process: ProcessComplete) => {
    setSelectedProcess(process);
    setShowProcessDetail(true);
  };

  const renderStatsCard = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas de Procesos</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.primary[600] }]}>{stats.porTipo.flora}</Text>
            <Text style={styles.statLabel}>Flora</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.secondary[600] }]}>{stats.porTipo.fauna}</Text>
            <Text style={styles.statLabel}>Fauna</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors.status.warning }]}>{stats.porEstado.custodia_temporal}</Text>
            <Text style={styles.statLabel}>En Custodia</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
        onPress={() => applyFilter('all')}
      >
        <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
          Todos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'flora' && styles.filterButtonActive]}
        onPress={() => applyFilter('flora')}
      >
        <Text style={[styles.filterButtonText, selectedFilter === 'flora' && styles.filterButtonTextActive]}>
          Flora
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'fauna' && styles.filterButtonActive]}
        onPress={() => applyFilter('fauna')}
      >
        <Text style={[styles.filterButtonText, selectedFilter === 'fauna' && styles.filterButtonTextActive]}>
          Fauna
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessCard = (process: ProcessComplete) => (
    <TouchableOpacity
      key={process.id}
      style={styles.processCard}
      onPress={() => openProcessDetail(process)}
    >
      <View style={styles.processHeader}>
        <View style={styles.processIdContainer}>
          <Ionicons
            name={process.tipo === 'flora' ? 'leaf' : 'paw'}
            size={20}
            color={process.tipo === 'flora' ? Colors.primary[600] : Colors.secondary[600]}
          />
          <Text style={styles.processId}>{process.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(process.estado) }]}>
          <Text style={styles.statusText}>{getStatusText(process.estado)}</Text>
        </View>
      </View>
      
      <Text style={styles.processTitle}>
        {process.tipo === 'flora' 
          ? process.detallesFlora?.identificacion.nombreComun
          : process.detallesFauna?.identificacion.nombreComun}
      </Text>
      
      <Text style={styles.processScientificName}>
        {process.tipo === 'flora'
          ? process.detallesFlora?.identificacion.nombreCientifico
          : process.detallesFauna?.identificacion.nombreCientifico}
      </Text>
      
      <View style={styles.processInfo}>
        <Text style={styles.processActivity}>{getActivityText(process.tipoActividad)}</Text>
        <Text style={styles.processDate}>{formatDate(process.fechaHora)}</Text>
      </View>
      
      <Text style={styles.processLocation}>
        {process.ubicacion.municipio}, {process.ubicacion.departamento}
      </Text>
    </TouchableOpacity>
  );

  const renderProcessDetail = () => {
    if (!selectedProcess) return null;

    return (
      <Modal
        visible={showProcessDetail}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalle del Proceso</Text>
            <TouchableOpacity onPress={() => setShowProcessDetail(false)}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Información General</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID:</Text>
                <Text style={styles.detailValue}>{selectedProcess.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tipo:</Text>
                <Text style={styles.detailValue}>{selectedProcess.tipo.toUpperCase()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Actividad:</Text>
                <Text style={styles.detailValue}>{getActivityText(selectedProcess.tipoActividad)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(selectedProcess.estado) }]}>
                  {getStatusText(selectedProcess.estado)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedProcess.fechaHora)}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Ubicación</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Departamento:</Text>
                <Text style={styles.detailValue}>{selectedProcess.ubicacion.departamento}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Municipio:</Text>
                <Text style={styles.detailValue}>{selectedProcess.ubicacion.municipio}</Text>
              </View>
              {selectedProcess.ubicacion.vereda && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vereda:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.ubicacion.vereda}</Text>
                </View>
              )}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Narración</Text>
              <Text style={styles.detailNarration}>{selectedProcess.narracion}</Text>
            </View>

            {selectedProcess.tipo === 'flora' && selectedProcess.detallesFlora && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Detalles de Flora</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Producto:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFlora.identificacion.tipoProducto}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nombre Común:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFlora.identificacion.nombreComun}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nombre Científico:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFlora.identificacion.nombreCientifico}</Text>
                </View>
                {selectedProcess.detallesFlora.cuantificacion.volumen && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Volumen:</Text>
                    <Text style={styles.detailValue}>{selectedProcess.detallesFlora.cuantificacion.volumen} m³</Text>
                  </View>
                )}
                {selectedProcess.detallesFlora.cuantificacion.peso && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Peso:</Text>
                    <Text style={styles.detailValue}>{selectedProcess.detallesFlora.cuantificacion.peso} kg</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Unidades:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFlora.cuantificacion.cantidadUnidades}</Text>
                </View>
              </View>
            )}

            {selectedProcess.tipo === 'fauna' && selectedProcess.detallesFauna && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Detalles de Fauna</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Clase:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFauna.identificacion.clase}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFauna.identificacion.estado}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sexo:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFauna.identificacion.sexo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado Físico:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFauna.valoracion.estadoFisico}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Comportamiento:</Text>
                  <Text style={styles.detailValue}>{selectedProcess.detallesFauna.valoracion.comportamiento}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando procesos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Procesos</Text>
        <Text style={styles.subtitle}>Flora y Fauna</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderStatsCard()}
        {renderFilterButtons()}
        
        <View style={styles.processesContainer}>
          <Text style={styles.sectionTitle}>Procesos Registrados</Text>
          {processes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color={Colors.neutral[400]} />
              <Text style={styles.emptyText}>No hay procesos registrados</Text>
            </View>
          ) : (
            processes.map(renderProcessCard)
          )}
        </View>
      </ScrollView>

      {/* Botones flotantes para crear procesos */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => setFaunaFormVisible(true)}
        >
          <Ionicons name="paw" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabPrimary]}
          onPress={() => setFloraFormVisible(true)}
        >
          <Ionicons name="leaf" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {renderProcessDetail()}
      
      {/* Formularios modales */}
      <FloraProcessForm
        visible={floraFormVisible}
        onClose={() => setFloraFormVisible(false)}
        onSubmit={handleProcessCreated}
      />
      
      <FaunaProcessForm
        visible={faunaFormVisible}
        onClose={() => setFaunaFormVisible(false)}
        onSubmit={handleProcessCreated}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary[600],
  },
  title: {
    ...TextStyles.h1,
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.primary[100],
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    ...TextStyles.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...TextStyles.h2,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterButtonText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
  },
  filterButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  processesContainer: {
    padding: 16,
  },
  sectionTitle: {
    ...TextStyles.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  processCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  processHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  processIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    processId: {
     ...TextStyles.bodyMedium,
     color: Colors.text.secondary,
     marginLeft: 8,
     fontWeight: '600',
    },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...TextStyles.bodySmall,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  processTitle: {
    ...TextStyles.h4,
    color: Colors.text.primary,
    marginBottom: 4,
  },
    processScientificName: {
     ...TextStyles.bodyMedium,
     color: Colors.text.secondary,
     fontStyle: 'italic',
     marginBottom: 8,
    },
  processInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  processActivity: {
    ...TextStyles.bodyMedium,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  processDate: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
  },
  processLocation: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    ...TextStyles.h2,
    color: Colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    ...TextStyles.h3,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    width: 120,
    fontWeight: '600',
  },
  detailValue: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    flex: 1,
  },
  detailNarration: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabPrimary: {
    backgroundColor: Colors.primary[600],
  },
  fabSecondary: {
    backgroundColor: Colors.secondary[600],
  },
});

export default ProcessesScreen;