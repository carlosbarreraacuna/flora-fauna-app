import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
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
import { FloraSpecies } from '../../data/demoData';

const { width } = Dimensions.get('window');

export default function FloraScreen() {
  const { isDemoMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [floraData, setFloraData] = useState<FloraSpecies[]>([]);
  const [filteredData, setFilteredData] = useState<FloraSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFloraData();
  }, [isDemoMode]);

  useEffect(() => {
    filterData(searchQuery, selectedFilter);
  }, [floraData, searchQuery, selectedFilter]);

  const loadFloraData = async () => {
    try {
      setIsLoading(true);
      if (isDemoMode) {
        const data = await demoDataService.getFloraSpecies();
        setFloraData(data);
      } else {
        // TODO: Load from API when not in demo mode
        // const data = await ApiService.getFloraSpecies();
        // setFloraData(data);
      }
    } catch (error) {
      console.error('Error loading flora data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de flora');
    } finally {
      setIsLoading(false);
    }
  };


  const statusColors = {
    'Común': Colors.conservation.common,
    'Vulnerable': Colors.conservation.vulnerable,
    'En Peligro': Colors.conservation.endangered,
    'Crítico': Colors.conservation.critical
  };

  const filters = ['Todos', 'Común', 'Vulnerable', 'En Peligro', 'Crítico'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterData(searchQuery, filter);
  };

  const filterData = (query: string, filter: string) => {
    let filtered = floraData;

    if (filter !== 'Todos') {
      filtered = filtered.filter(item => item.status === filter);
    }

    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(query.toLowerCase()) ||
        item.family.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const FloraCard = ({ item }: { item: FloraSpecies }) => (
    <TouchableOpacity 
      style={styles.floraCard}
      onPress={() => Alert.alert(item.name, item.description)}
    >
      <View style={styles.cardImageContainer}>
        <View style={[styles.cardImage, { backgroundColor: statusColors[item.status] + '30' }]}>
          <Ionicons name="leaf" size={40} color={statusColors[item.status]} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardScientific}>{item.scientificName}</Text>
        <Text style={styles.cardFamily}>Familia: {item.family}</Text>
        
        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <View style={styles.characteristicsContainer}>
          {item.characteristics.slice(0, 2).map((char, index) => (
            <View key={index} style={styles.characteristicTag}>
              <Text style={styles.characteristicText}>{char}</Text>
            </View>
          ))}
        </View>
      </View>
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
          <View style={styles.headerTitle}>
            <Ionicons name="leaf" size={28} color="white" />
            <Text style={styles.headerText}>Flora de Colombia</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          Descubre la diversidad botánica de nuestro país
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar especies, familia, nombre científico..."
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

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Estado de Conservación</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Especies Encontradas ({filteredData.length})
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Ionicons name="funnel-outline" size={16} color="#2E7D32" />
              <Text style={styles.sortText}>Ordenar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.floraGrid}>
            {filteredData.map((item) => (
              <FloraCard key={item.id} item={item} />
            ))}
          </View>
          
          {filteredData.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No se encontraron especies</Text>
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
    ...TextStyles.navTitle,
    color: 'white',
    marginLeft: 10,
  },
  headerSubtitle: {
    ...TextStyles.navSubtitle,
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
    ...TextStyles.inputText,
    color: Colors.text.primary,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    ...TextStyles.h5,
    color: Colors.text.primary,
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
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterButtonText: {
    ...TextStyles.buttonSmall,
    color: Colors.text.secondary,
  },
  filterButtonTextActive: {
    ...TextStyles.buttonSmall,
    color: 'white',
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
    ...TextStyles.h4,
    color: Colors.text.primary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  sortText: {
    ...TextStyles.caption,
    color: Colors.primary[700],
    marginLeft: 4,
    fontWeight: '600',
  },
  floraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  floraCard: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    ...TextStyles.cardTitle,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardScientific: {
    ...TextStyles.scientific,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  cardFamily: {
    ...TextStyles.caption,
    color: Colors.text.hint,
    marginBottom: 8,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characteristicTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  characteristicText: {
    ...TextStyles.tag,
    color: Colors.primary[700],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    ...TextStyles.h4,
    color: Colors.text.hint,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    ...TextStyles.bodyMedium,
    color: Colors.text.disabled,
    textAlign: 'center',
  },
});