import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, ColorUtils } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import { demoDataService } from '../../services/demoDataService';
import { Report } from '../../data/demoData';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { isDemoMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [reportsData, setReportsData] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, [isDemoMode]);

  useEffect(() => {
    filterReports(searchQuery, selectedType, selectedStatus);
  }, [reportsData, searchQuery, selectedType, selectedStatus]);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      if (isDemoMode) {
        const data = await demoDataService.getReports();
        setReportsData(data);
      } else {
        // TODO: Load from API when not in demo mode
        // const data = await ApiService.getReports();
        // setReportsData(data);
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const typeColors = {
    'Avistamiento': '#4CAF50',
    'Conservación': '#2196F3',
    'Amenaza': '#FF5722',
    'Investigación': '#9C27B0'
  };

  const statusColors = {
    'Pendiente': Colors.status.warning,
    'En Revisión': Colors.status.info,
    'Aprobado': Colors.status.success,
    'Rechazado': Colors.status.error
  };

  const priorityColors = {
    'Baja': Colors.priority.low,
    'Media': Colors.priority.medium,
    'Alta': Colors.priority.high,
    'Crítica': Colors.priority.critical
  };

  const types = ['Todos', 'Avistamiento', 'Conservación', 'Amenaza', 'Investigación'];
  const statuses = ['Todos', 'Pendiente', 'En Revisión', 'Aprobado', 'Rechazado'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const filterReports = (query: string, type: string, status: string) => {
    let filtered = reportsData;

    if (type !== 'Todos') {
      filtered = filtered.filter(report => report.type === type);
    }

    if (status !== 'Todos') {
      filtered = filtered.filter(report => report.status === status);
    }

    if (query) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(query.toLowerCase()) ||
        report.species.toLowerCase().includes(query.toLowerCase()) ||
        report.location.toLowerCase().includes(query.toLowerCase()) ||
        report.reporter.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <TouchableOpacity 
      style={styles.reportCard}
      onPress={() => Alert.alert(report.title, report.description)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.typeBadge, { backgroundColor: typeColors[report.type] }]}>
            <Text style={styles.typeBadgeText}>{report.type}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[report.priority] }]}>
            <Text style={styles.priorityBadgeText}>{report.priority}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[report.status] }]}>
          <Text style={styles.statusBadgeText}>{report.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{report.title}</Text>
        <Text style={styles.cardSpecies}>{report.species}</Text>
        
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{report.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{new Date(report.date).toLocaleDateString('es-CO')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{report.reporter}</Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>
          {report.description}
        </Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="eye-outline" size={16} color="#2196F3" />
          <Text style={styles.actionButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={16} color="#FF9800" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1565C0', '#1976D2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <Ionicons name="document-text" size={28} color="white" />
            <Text style={styles.headerText}>Reportes</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          Gestiona reportes de flora y fauna
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar reportes, especies, ubicación..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reportsData.length}</Text>
            <Text style={styles.statLabel}>Total Reportes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reportsData.filter(r => r.status === 'Pendiente').length}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {reportsData.filter(r => r.priority === 'Crítica').length}
            </Text>
            <Text style={styles.statLabel}>Críticos</Text>
          </View>
        </View>

        {/* Type Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Tipo de Reporte</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  selectedType === type && styles.filterButtonActive
                ]}
                onPress={() => handleTypeChange(type)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedType === type && styles.filterButtonTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Status Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Estado</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  selectedStatus === status && styles.filterButtonActive
                ]}
                onPress={() => handleStatusChange(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.filterButtonTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Reportes ({filteredReports.length})
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="funnel-outline" size={16} color="#1976D2" />
              <Text style={styles.sortText}>Ordenar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reportsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando reportes...</Text>
              </View>
            ) : (
              filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </View>
          
          {!isLoading && filteredReports.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No se encontraron reportes</Text>
              <Text style={styles.emptySubtitle}>
                Intenta ajustar los filtros o términos de búsqueda
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  sortText: {
    ...TextStyles.caption,
    color: Colors.primary[700],
    marginLeft: 4,
    fontWeight: '600',
  },
  reportsContainer: {
    gap: 15,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeText: {
    ...TextStyles.tag,
    color: 'white',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityBadgeText: {
    ...TextStyles.tag,
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    ...TextStyles.tag,
    color: 'white',
  },
  cardContent: {
    marginBottom: 15,
  },
  cardTitle: {
    ...TextStyles.cardTitle,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardSpecies: {
    ...TextStyles.cardSubtitle,
    fontStyle: 'italic',
    color: Colors.text.secondary,
    marginBottom: 10,
  },
  cardInfo: {
    gap: 4,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  cardDescription: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
  },
  actionButtonText: {
    ...TextStyles.caption,
    marginLeft: 6,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});