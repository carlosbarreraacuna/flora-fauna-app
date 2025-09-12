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
import { FaunaSpecies } from '../../data/demoData';

const { width } = Dimensions.get('window');

export default function FaunaScreen() {
  const { isDemoMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [faunaData, setFaunaData] = useState<FaunaSpecies[]>([]);
  const [filteredData, setFilteredData] = useState<FaunaSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFaunaData();
  }, [isDemoMode]);

  useEffect(() => {
    filterData(searchQuery, selectedFilter, selectedType);
  }, [faunaData, searchQuery, selectedFilter, selectedType]);

  const loadFaunaData = async () => {
    try {
      setIsLoading(true);
      if (isDemoMode) {
        const data = await demoDataService.getFaunaSpecies();
        setFaunaData(data);
      } else {
        // TODO: Load from API when not in demo mode
        // const data = await ApiService.getFaunaSpecies();
        // setFaunaData(data);
      }
    } catch (error) {
      console.error('Error loading fauna data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de fauna');
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

  const typeIcons = {
    'Mamífero': 'paw',
    'Ave': 'airplane',
    'Reptil': 'bug',
    'Anfibio': 'water',
    'Pez': 'fish',
    'Insecto': 'bug-outline'
  };

  const filters = ['Todos', 'Común', 'Vulnerable', 'En Peligro', 'Crítico'];
  const types = ['Todos', 'Mamífero', 'Ave', 'Reptil', 'Anfibio', 'Pez', 'Insecto'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterData(query, selectedFilter, selectedType);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    filterData(searchQuery, filter, selectedType);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    filterData(searchQuery, selectedFilter, type);
  };

  const filterData = (query: string, filter: string, type: string) => {
    let filtered = faunaData;

    if (filter !== 'Todos') {
      filtered = filtered.filter(item => item.conservationStatus === filter);
    }

    if (type !== 'Todos') {
      filtered = filtered.filter(item => item.type === type);
    }

    if (query) {
      filtered = filtered.filter(item => 
        item.commonName.toLowerCase().includes(query.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(query.toLowerCase()) ||
        item.family.toLowerCase().includes(query.toLowerCase()) ||
        item.habitat.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const FaunaCard = ({ item }: { item: FaunaSpecies }) => (
    <TouchableOpacity 
      style={styles.faunaCard}
      onPress={() => Alert.alert(item.commonName, item.description)}
    >
      <View style={styles.cardImageContainer}>
        <View style={[styles.cardImage, { backgroundColor: statusColors[item.conservationStatus] + '30' }]}>
          <Ionicons name={typeIcons[item.type] as any} size={40} color={statusColors[item.conservationStatus]} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.conservationStatus] }]}>
          <Text style={styles.statusText}>{item.conservationStatus}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.commonName}</Text>
        <Text style={styles.cardScientific}>{item.scientificName}</Text>
        <Text style={styles.cardFamily}>Familia: {item.family}</Text>
        
        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{item.habitat}</Text>
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
      <StatusBar barStyle="light-content" backgroundColor="#BF360C" />
      
      {/* Header */}
      <LinearGradient
        colors={['#BF360C', '#FF5722']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <Ionicons name="paw" size={28} color="white" />
            <Text style={styles.headerText}>Fauna de Colombia</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerSubtitle}>
          Explora la riqueza animal de nuestros ecosistemas
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar especies, familia, hábitat..."
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

        {/* Type Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Tipo de Animal</Text>
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
              <Ionicons name="funnel-outline" size={16} color="#FF5722" />
              <Text style={styles.sortText}>Ordenar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.faunaGrid}>
            {filteredData.map((item) => (
              <FaunaCard key={item.id} item={item} />
            ))}
          </View>
          
          {filteredData.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="paw-outline" size={64} color="#ccc" />
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
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
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
    borderColor: '#FF5722',
  },
  sortText: {
    ...TextStyles.caption,
    color: Colors.primary[700],
    marginLeft: 4,
    fontWeight: '600',
  },
  faunaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  faunaCard: {
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
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  typeText: {
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
    backgroundColor: '#FFF3E0',
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