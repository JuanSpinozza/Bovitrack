import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AnimalForm } from '../../interfaces/animal.types';
import { opcionesEstadoReproductivo } from '../..//constants/animal.constant';

interface ReproductiveSectionProps {
  form: AnimalForm;
  handleChange: (field: keyof AnimalForm, value: any) => void;
}

export default function ReproductiveSection({ form, handleChange }: ReproductiveSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Información Reproductiva</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estado reproductivo</Text>
        <Dropdown
          style={styles.dropdown}
          data={opcionesEstadoReproductivo}
          labelField="label"
          valueField="value"
          placeholder="Seleccione estado"
          value={form['Estado reproductivo']}
          onChange={(item) => handleChange('Estado reproductivo', item.value)}
        />
      </View>
      
      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Fecha último celo</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form['Fecha del último celo'] || ''}
            onChangeText={(text) => handleChange('Fecha del último celo', text)}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Número de partos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 2"
            keyboardType="numeric"
            value={form['Número de partos'] || ''}
            onChangeText={(text) => handleChange('Número de partos', text)}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Fecha servicio/inseminación</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form['Fecha de servicio o inseminación'] || ''}
            onChangeText={(text) => handleChange('Fecha de servicio o inseminación', text)}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>ID del toro</Text>
          <TextInput
            style={styles.input}
            placeholder="ID del toro"
            value={form['ID del toro utilizado'] || ''}
            onChangeText={(text) => handleChange('ID del toro utilizado', text)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha último parto</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={form['Fecha del último parto'] || ''}
          onChangeText={(text) => handleChange('Fecha del último parto', text)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005246',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
});