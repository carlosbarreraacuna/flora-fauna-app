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
import { FloraProcessComplete, FloraProductType, ActivityType } from '../../types/processes';
import { Colors } from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { demoDataService } from '../../services/demoDataService';

interface FloraProcessFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (process: FloraProcessComplete) => void;
  initialData?: Partial<FloraProcessComplete>;
}

const FloraProcessForm: React.FC<FloraProcessFormProps> = ({
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
    
    // Identificación del producto
    tipoProducto: 'bloques' as FloraProductType,
    nombreComun: '',
    nombreCientifico: '',
    
    // Cuantificación
    volumen: '',
    peso: '',
    cantidadUnidades: '',
    largo: '',
    ancho: '',
    alto: '',
    unidadDimensiones: 'cm' as 'cm' | 'm',
    
    // Documentación SUNL
    tieneSUNL: false,
    numeroSUNL: '',
    vigenciaSUNL: '',
    origenSUNL: '',
    destinoSUNL: '',
    placaVehiculo: '',
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

  const tiposProducto: { value: FloraProductType; label: string }[] = [
    { value: 'bloques', label: 'Bloques' },
    { value: 'tablas', label: 'Tablas' },
    { value: 'leña', label: 'Leña' },
    { value: 'carbon', label: 'Carbón' },
    { value: 'otros', label: 'Otros' }
  ];

  const tiposActividad: { value: ActivityType; label: string }[] = [
    { value: 'incautacion', label: 'Incautación' },
    { value: 'entrega_voluntaria', label: 'Entrega Voluntaria' },
    { value: 'restitucion', label: 'Restitución' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones obligatorias
    if (!formData.tipoActividad) newErrors.tipoActividad = 'Tipo de actividad es obligatorio';
    if (!formData.departamento) newErrors.departamento = 'Departamento es obligatorio';
    if (!formData.municipio) newErrors.municipio = 'Municipio es obligatorio';
    if (!formData.narracion.trim()) newErrors.narracion = 'Narración es obligatoria';
    if (!formData.nombreComun.trim()) newErrors.nombreComun = 'Nombre común es obligatorio';
    if (!formData.nombreCientifico.trim()) newErrors.nombreCientifico = 'Nombre científico es obligatorio';
    if (!formData.cantidadUnidades) newErrors.cantidadUnidades = 'Cantidad de unidades es obligatoria';

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

    // Validaciones numéricas
    if (formData.volumen && isNaN(Number(formData.volumen))) {
      newErrors.volumen = 'Volumen debe ser un número válido';
    }
    if (formData.peso && isNaN(Number(formData.peso))) {
      newErrors.peso = 'Peso debe ser un número válido';
    }
    if (formData.cantidadUnidades && isNaN(Number(formData.cantidadUnidades))) {
      newErrors.cantidadUnidades = 'Cantidad debe ser un número válido';
    }
    if (formData.latitud && (isNaN(Number(formData.latitud)) || Math.abs(Number(formData.latitud)) > 90)) {
      newErrors.latitud = 'Latitud debe ser un número válido entre -90 y 90';
    }
    if (formData.longitud && (isNaN(Number(formData.longitud)) || Math.abs(Number(formData.longitud)) > 180)) {
      newErrors.longitud = 'Longitud debe ser un número válido entre -180 y 180';
    }

    // Validaciones SUNL
    if (formData.tieneSUNL) {
      if (!formData.numeroSUNL.trim()) newErrors.numeroSUNL = 'Número SUNL es obligatorio';
      if (!formData.vigenciaSUNL.trim()) newErrors.vigenciaSUNL = 'Vigencia SUNL es obligatoria';
      if (!formData.origenSUNL.trim()) newErrors.origenSUNL = 'Origen SUNL es obligatorio';
      if (!formData.destinoSUNL.trim()) newErrors.destinoSUNL = 'Destino SUNL es obligatorio';
      if (!formData.placaVehiculo.trim()) newErrors.placaVehiculo = 'Placa del vehículo es obligatoria';
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
      const processData: Omit<FloraProcessComplete, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
        tipo: 'flora',
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
        detallesFlora: {
          identificacion: {
            tipoProducto: formData.tipoProducto,
            nombreComun: formData.nombreComun,
            nombreCientifico: formData.nombreCientifico
          },
          cuantificacion: {
            volumen: formData.volumen ? Number(formData.volumen) : undefined,
            peso: formData.peso ? Number(formData.peso) : undefined,
            cantidadUnidades: Number(formData.cantidadUnidades),
            dimensiones: (formData.largo || formData.ancho || formData.alto) ? {
              largo: formData.largo ? Number(formData.largo) : undefined,
              ancho: formData.ancho ? Number(formData.ancho) : undefined,
              alto: formData.alto ? Number(formData.alto) : undefined,
              unidad: formData.unidadDimensiones
            } : undefined
          },
          documentacion: {
            sunl: formData.tieneSUNL ? {
              numero: formData.numeroSUNL,
              vigencia: formData.vigenciaSUNL,
              origen: formData.origenSUNL,
              destino: formData.destinoSUNL,
              placaVehiculo: formData.placaVehiculo
            } : undefined
          },
          soporteMultimedia: {
            fotografias: [] // En una implementación real, aquí se manejarían las imágenes
          }
        }
      };

      const createdProcess = await demoDataService.createProcess(processData);
      onSubmit(createdProcess as FloraProcessComplete);
      Alert.alert('Éxito', 'Proceso de flora creado correctamente');
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Proceso de Flora</Text>
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

          {/* Identificación del Producto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identificación del Producto</Text>
            {renderPicker('tipoProducto', 'Tipo de Producto *', tiposProducto)}
            {renderInput('nombreComun', 'Nombre Común *', 'Ej: Cedro, Roble, etc.')}
            {renderInput('nombreCientifico', 'Nombre Científico *', 'Ej: Cedrela odorata')}
          </View>

          {/* Cuantificación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuantificación</Text>
            {renderInput('volumen', 'Volumen (m³)', 'Volumen en metros cúbicos', { keyboardType: 'numeric' })}
            {renderInput('peso', 'Peso (kg)', 'Peso en kilogramos', { keyboardType: 'numeric' })}
            {renderInput('cantidadUnidades', 'Cantidad de Unidades *', 'Número de piezas', { keyboardType: 'numeric' })}
            
            <Text style={styles.subsectionTitle}>Dimensiones (opcional)</Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('largo', 'Largo', 'cm o m', { keyboardType: 'numeric' })}
              </View>
              <View style={styles.halfInput}>
                {renderInput('ancho', 'Ancho', 'cm o m', { keyboardType: 'numeric' })}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('alto', 'Alto', 'cm o m', { keyboardType: 'numeric' })}
              </View>
              <View style={styles.halfInput}>
                {renderPicker('unidadDimensiones', 'Unidad', [
                  { value: 'cm', label: 'Centímetros' },
                  { value: 'm', label: 'Metros' }
                ])}
              </View>
            </View>
          </View>

          {/* Documentación SUNL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentación SUNL</Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setFormData(prev => ({ ...prev, tieneSUNL: !prev.tieneSUNL }))}
            >
              <Ionicons
                name={formData.tieneSUNL ? 'checkbox' : 'square-outline'}
                size={24}
                color={Colors.primary[600]}
              />
              <Text style={styles.checkboxLabel}>Tiene documentación SUNL</Text>
            </TouchableOpacity>
            
            {formData.tieneSUNL && (
              <>
                {renderInput('numeroSUNL', 'Número SUNL *', 'Ej: SUNL-2024-001234')}
                {renderInput('vigenciaSUNL', 'Vigencia *', 'Fecha de vigencia')}
                {renderInput('origenSUNL', 'Origen *', 'Lugar de origen')}
                {renderInput('destinoSUNL', 'Destino *', 'Lugar de destino')}
                {renderInput('placaVehiculo', 'Placa del Vehículo *', 'Ej: ABC-123')}
              </>
            )}
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
  subsectionTitle: {
    ...TextStyles.h4,
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    ...TextStyles.bodyMedium,
    color: Colors.text.primary,
    marginLeft: 8,
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

export default FloraProcessForm;