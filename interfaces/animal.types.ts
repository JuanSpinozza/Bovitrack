export interface AnimalForm {
  // Campos básicos
  'ID o código': string;
  'Nombre': string;
  'Raza': string;
  'Características del animal': string;
  'Fecha de nacimiento': string;
  'Lugar de nacimiento': string;
  'Peso actual': string;
  'Fecha del último pesaje': string;
  'Estado de salud': string;
  'Lote o potrero actual': string;
  'Propietario o encargado': string;
  'Fecha de ingreso al hato': string;
    'Estado reproductivo': string;
  'Estado productivo': string; // Nuevo campo
  'Fecha del último celo': string;
  'Fecha de servicio o inseminación': string;
  'ID del toro utilizado': string;
  'Número de partos': string;
  'Fecha del último parto': string;

  condicionCorporal: number;
  proposito: string;
}

export interface Vaccine {
  id?: string;
  nombre_vacuna: string;
  fecha_aplicacion: string;
  dosis: string;
  via_administracion: string;
  proxima_dosis: string;
  vacuna_fabricante: string;
  fecha_vencimiento_lote: string;
  administrado_por: string;
  lugar_aplicacion: string;
  periodo_retiro_leche_dias: string;
  periodo_retiro_carne_dias: string;
  costo: string;
  observaciones: string;
}

export interface Deworming {
  id?: string;
  nombre_producto: string;
  tipo_parasito: string;
  fecha_aplicacion: string;
  dosis: string;
  via_administracion: string;
  proxima_aplicacion: string;
  ingrediente_activo: string;
  administrado_por: string;
  lugar_aplicacion: string;
  eficacia_verificacion_fecha: string;
  resistencia_sospechada: string;
  costo: string;
  observaciones: string;
}

export interface Treatment {
  id?: string;
  nombre_tratamiento: string;
  diagnostico_motivo: string;
  fecha_inicio: string;
  medicamento_producto: string;
  descripcion_tratamiento: string;
  via_administracion: string;
  duracion_dias: string;
  fecha_fin: string;
  veterinario_responsable: string;
  costo: string;
  evolucion_observaciones: string;
  proxima_revision_fecha: string;
}

export interface Disease {
  id?: string;
  nombre_enfermedad: string;
  fecha_diagnostico: string;
  estado_actual: string;
  descripcion_tratamiento_aplicado: string;
  gravedad: string;
  fecha_recuperacion: string;
  observaciones: string;
  riesgo_recurrencia: string;
}

export interface WeightRecord {
  id?: string;
  fecha: string;
  peso: string;
  observaciones: string;
}