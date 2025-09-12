import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { FaunaProcessComplete, FaunaClass, SpecimenState, SpecimenSex, ActivityType } from '../../types/processes';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { demoDataService } from '../../services/demoDataService';

interface FaunaProcessFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (process: FaunaProcessComplete) => void;
  initialData?: Partial<FaunaProcessComplete>;
}

const FaunaProcessForm: React.FC<FaunaProcessFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData
}) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Información general
    tipoActividad: 'incautacion' as ActivityType,
    
    // Ubicación
    departamento: '',
    municipio: '',
    vereda: '',
    latitud: '',
    longitud: '',
    
    // Narración
    narracion: '',
    
    // Reportante
    tipoReportante: 'natural' as 'natural' | 'juridica',
    nombrePersona: '',
    documentoPersona: '',
    contactoPersona: '',
    razonSocial: '',
    nit: '',
    representanteLegal: '',
    contactoEmpresa: '',
    
    // Identificación del espécimen
    nombreComun: '',
    nombreCientifico: '',
    clase: 'mamifero' as FaunaClass,
    estado: 'vivo' as SpecimenState,
    sexo: 'desconocido' as SpecimenSex,
    
    // Valoración inicial
    estadoFisico: '',
    comportamiento: '',
    
    // Embalaje y transporte
    descripcionEmbalaje: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const departamentosColombia = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
    'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
    'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ];

  const clasesFauna: { value: FaunaClass; label: string }[] = [
    { value: 'mamifero', label: 'Mamífero' },
    { value: 'ave', label: 'Ave' },
    { value: 'reptil', label: 'Reptil' },
    { value: 'pez', label: 'Pez' },
    { value: 'anfibio', label: 'Anfibio' },
    { value: 'invertebrado', label: 'Invertebrado' }
  ];

  const estadosEspecimen: { value: SpecimenState; label: string }[] = [
    { value: 'vivo', label: 'Vivo' },
    { value: 'muerto', label: 'Muerto' },
    { value: 'herido', label: 'Herido' }
  ];

  const sexosEspecimen: { value: SpecimenSex; label: string }[] = [
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' },
    { value: 'desconocido', label: 'Desconocido' }
  ];

  const tiposActividad: { value: ActivityType; label: string }[] = [
    { value: 'incautacion', label: 'Incautación' },
    { value: 'entrega_voluntaria', label: 'Entrega Voluntaria' },
    { value: 'restitucion', label: 'Restitución' }
  ];

  // Especies comunes de fauna colombiana por clase
  const especiesComunes: Record<FaunaClass, string[]> = {
    mamifero: [
      'Oso hormiguero', 'Perezoso', 'Armadillo', 'Mono aullador', 'Mono araña',
      'Jaguar', 'Puma', 'Ocelote', 'Venado', 'Tapir', 'Nutria', 'Murciélago'
    ],
    ave: [
      'Guacamaya', 'Loro', 'Tucán', 'Águila', 'Halcón', 'Búho', 'Colibrí',
      'Cóndor', 'Pelícano', 'Garza', 'Ibis', 'Flamenco'
    ],
    reptil: [
      'Iguana', 'Boa', 'Anaconda', 'Caimán', 'Tortuga', 'Gecko', 'Lagarto',
      'Serpiente coral', 'Cascabel', 'Tortuga carey'
    ],
    pez: [
      'Bagre', 'Bocachico', 'Dorado', 'Sábalo', 'Tilapia', 'Trucha',
      'Pez ángel', 'Piraña', 'Raya', 'Tiburón'
    ],
    anfibio: [
      'Rana venenosa', 'Salamandra', 'Tritón', 'Rana arbórea', 'Sapo',
      'Cecilia', 'Rana de cristal'
    ],
    invertebrado: [
      'Mariposa', 'Escarabajo', 'Araña', 'Escorpión', 'Libélula',
      'Hormiga', 'Abeja', 'Caracol', 'Cangrejo'
    ]
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones obligatorias
    if (!formData.tipoActividad) newErrors.tipoActividad = 'Tipo de actividad es obligatorio';
    if (!formData.departamento) newErrors.departamento = 'Departamento es obligatorio';
    if (!formData.municipio) newErrors.municipio = 'Municipio es obligatorio';
    if (!formData.narracion.trim()) newErrors.narracion = 'Narración es obligatoria';
    if (!formData.nombreComun.trim()) newErrors.nombreComun = 'Nombre común es obligatorio';
    if (!formData.nombreCientifico.trim()) newErrors.nombreCientifico = 'Nombre científico es obligatorio';
    if (!formData.estadoFisico.trim()) newErrors.estadoFisico = 'Descripción del estado físico es obligatoria';
    if (!formData.comportamiento.trim()) newErrors.comportamiento = 'Descripción del comportamiento es obligatoria';
    if (!formData.descripcionEmbalaje.trim()) newErrors.descripcionEmbalaje = 'Descripción del embalaje es obligatoria';

    // Validaciones del reportante
    if (formData.tipoReportante === 'natural') {
      if (!formData.nombrePersona.trim()) newErrors.nombrePersona = 'Nombre es obligatorio';
      if (!formData.documentoPersona.trim()) newErrors.documentoPersona = 'Documento es obligatorio';
      if (!formData.contactoPersona.trim()) newErrors.contactoPersona = 'Contacto es obligatorio';
    } else {
      if (!formData.razonSocial.trim()) newErrors.razonSocial = 'Razón social es obligatoria';
      if (!formData.nit.trim()) newErrors.nit = 'NIT es obligatorio';
      if (!formData.representanteLegal.trim()) newErrors.representanteLegal = 'Representante legal es obligatorio';
      if (!formData.contactoEmpresa.trim()) newErrors.contactoEmpresa = 'Contacto es obligatorio';
    }

    // Validaciones de coordenadas
    if (formData.latitud && (isNaN(Number(formData.latitud)) || Math.abs(Number(formData.latitud)) > 90)) {
      newErrors.latitud = 'Latitud debe ser un número válido entre -90 y 90';
    }
    if (formData.longitud && (isNaN(Number(formData.longitud)) || Math.abs(Number(formData.longitud)) > 180)) {
      newErrors.longitud = 'Longitud debe ser un número válido entre -180 y 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      const processData: Omit<FaunaProcessComplete, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
        tipo: 'fauna',
        tipoActividad: formData.tipoActividad,
        fechaHora: new Date().toISOString(),
        ubicacion: {
          departamento: formData.departamento,
          municipio: formData.municipio,
          vereda: formData.vereda || undefined,
          coordenadas: formData.latitud && formData.longitud ? {
            latitud: Number(formData.latitud),
            longitud: Number(formData.longitud)
          } : undefined
        },
        narracion: formData.narracion,
        reportante: {
          tipo: formData.tipoReportante,
          personaNatural: formData.tipoReportante === 'natural' ? {
            nombre: formData.nombrePersona,
            documento: formData.documentoPersona,
            contacto: formData.contactoPersona
          } : undefined,
          personaJuridica: formData.tipoReportante === 'juridica' ? {
            razonSocial: formData.razonSocial,
            nit: formData.nit,
            representanteLegal: formData.representanteLegal,
            contacto: formData.contactoEmpresa
          } : undefined
        },
        estado: 'iniciado',
        usuarioCreador: 'demo_user',
        detallesFauna: {
          identificacion: {
            nombreComun: formData.nombreComun,
            nombreCientifico: formData.nombreCientifico,
            clase: formData.clase,
            estado: formData.estado,
            sexo: formData.sexo
          },
          valoracionInicial: {
            estadoFisico: formData.estadoFisico,
            comportamiento: formData.comportamiento
          },
          embalajeTransporte: {
            descripcion: formData.descripcionEmbalaje
          },
          soporteMultimedia: {
            fotografias: [] // En una implementación real, aquí se manejarían las imágenes
          }
        }
      };

      const createdProcess = await demoDataService.createProcess(processData);
      onSubmit(createdProcess as FaunaProcessComplete);
      Alert.alert('Éxito', 'Proceso de fauna creado correctamente');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el proceso');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: string, label: string, placeholder: string, options?: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        placeholder={placeholder}
        value={formData[key as keyof typeof formData] as string}
        onChangeText={(value) => setFormData(prev => ({ ...prev, [key]: value }))}
        {...options}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderPicker = (key: string, label: string, items: { value: string; label: string }[]) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.pickerContainer, errors[key] && styles.inputError]}>
        <Picker
          selectedValue={formData[key as keyof typeof formData]}
          onValueChange={(value) => setFormData(prev => ({ ...prev, [key]: value }))}
          style={styles.picker}
        >
          {items.map(item => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderSpeciesAutocomplete = () => {
    const especies = especiesComunes[formData.clase] || [];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nombre Común * (Sugerencias para {clasesFauna.find(c => c.value === formData.clase)?.label})</Text>
        <TextInput
          style={[styles.input, errors.nombreComun && styles.inputError]}
          placeholder="Ej: Jaguar, Guacamaya, Iguana..."
          value={formData.nombreComun}
          onChangeText={(value) => setFormData(prev => ({ ...prev, nombreComun: value }))}
        />
        {formData.nombreComun.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {especies
              .filter(especie => 
                especie.toLowerCase().includes(formData.nombreComun.toLowerCase())
              )
              .slice(0, 5)
              .map((especie, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => setFormData(prev => ({ ...prev, nombreComun: especie }))}
                >
                  <Text style={styles.suggestionText}>{especie}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        )}
        {errors.nombreComun && <Text style={styles.errorText}>{errors.nombreComun}</Text>}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Proceso de Fauna</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Información General */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información General</Text>
            {renderPicker('tipoActividad', 'Tipo de Actividad *', tiposActividad)}
            {renderInput('narracion', 'Narración de los Hechos *', 'Describe detalladamente lo ocurrido...', {
              multiline: true,
              numberOfLines: 4,
              textAlignVertical: 'top'
            })}
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            {renderPicker('departamento', 'Departamento *', 
              departamentosColombia.map(d => ({ value: d, label: d }))
            )}
            {renderInput('municipio', 'Municipio *', 'Ingresa el municipio')}
            {renderInput('vereda', 'Vereda', 'Ingresa la vereda (opcional)')}
            {renderInput('latitud', 'Latitud', 'Ej: 4.6097', { keyboardType: 'numeric' })}
            {renderInput('longitud', 'Longitud', 'Ej: -74.0817', { keyboardType: 'numeric' })}
          </View>

          {/* Reportante */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Reportante</Text>
            {renderPicker('tipoReportante', 'Tipo de Reportante', [
              { value: 'natural', label: 'Persona Natural' },
              { value: 'juridica', label: 'Persona Jurídica' }
            ])}
            
            {formData.tipoReportante === 'natural' ? (
              <>
                {renderInput('nombrePersona', 'Nombre Completo *', 'Ingresa el nombre completo')}
                {renderInput('documentoPersona', 'Documento *', 'Número de documento')}
                {renderInput('contactoPersona', 'Contacto *', 'Teléfono o email')}
              </>
            ) : (
              <>
                {renderInput('razonSocial', 'Razón Social *', 'Nombre de la empresa')}
                {renderInput('nit', 'NIT *', 'Número de identificación tributaria')}
                {renderInput('representanteLegal', 'Representante Legal *', 'Nombre del representante')}
                {renderInput('contactoEmpresa', 'Contacto *', 'Teléfono o email de la empresa')}
              </>
            )}
          </View>

          {/* Identificación del Espécimen */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identificación del Espécimen</Text>
            {renderPicker('clase', 'Clase *', clasesFauna)}
            {renderSpeciesAutocomplete()}
            {renderInput('nombreCientifico', 'Nombre Científico *', 'Ej: Panthera onca, Ara macao...')}
            {renderPicker('estado', 'Estado del Espécimen *', estadosEspecimen)}
            {renderPicker('sexo', 'Sexo *', sexosEspecimen)}
          </View>

          {/* Valoración Inicial */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valoración Inicial</Text>
            {renderInput('estadoFisico', 'Estado Físico *', 'Describe el estado físico del espécimen...', {
              multiline: true,
              numberOfLines: 3,
              textAlignVertical: 'top'
            })}
            {renderInput('comportamiento', 'Comportamiento *', 'Ej: agresivo, letárgico, desorientado, normal...', {
              multiline: true,
              numberOfLines: 3,
              textAlignVertical: 'top'
            })}
          </View>

          {/* Embalaje y Transporte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Embalaje y Transporte</Text>
            {renderInput('descripcionEmbalaje', 'Descripción del Embalaje *', 'Describe cómo fue embalado y transportado (caja, guacal, canil, condiciones de ventilación)...', {
              multiline: true,
              numberOfLines: 4,
              textAlignVertical: 'top'
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Guardando...' : 'Crear Proceso'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    ...TextStyles.h2,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TextStyles.h3,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
  },
  inputError: {
    borderColor: Colors.status.error,
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: Colors.status.error,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  suggestionsContainer: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  suggestionText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    alignItems: 'center',
  },
  cancelButtonText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  submitButtonText: {
    ...TextStyles.bodyMedium,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
});

export default FaunaProcessForm;