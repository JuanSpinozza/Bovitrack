export const opcionesEstadoSalud = [
  { label: 'Sano', value: 'Sano' },
  { label: 'Observación', value: 'Observación' },
  { label: 'Enfermo', value: 'Enfermo' },
  { label: 'En tratamiento', value: 'En tratamiento' },
];

export const opcionesEstadoReproductivo = [
  { label: 'Vacía', value: 'Vacía' },
  { label: 'En servicio', value: 'En servicio' },
  { label: 'En espera de diagnóstico', value: 'En espera de diagnóstico' },
  { label: 'Gestante', value: 'Gestante' },
  { label: 'Parida', value: 'Parida' },
  { label: 'Lactante', value: 'Lactante' },
  { label: 'Secada', value: 'Secada' },
  { label: 'Problema reproductivo', value: 'Problema reproductivo' },
];

export const opcionesLote = [
  { label: 'Lote A - Pastoreo Norte', value: 'Lote A' },
  { label: 'Lote B - Pastoreo Sur', value: 'Lote B' },
  { label: 'Lote C - Corral Principal', value: 'Lote C' },
];

export const opcionesProposito = [
  { label: 'Cría', value: 'Cría' },
  { label: 'Leche', value: 'Leche' },
  { label: 'Engorde / Ceba', value: 'Engorde / Ceba' },
  { label: 'Doble propósito / Multipropósito', value: 'Doble propósito / Multipropósito' },
];

export const opcionesViaAdministracion = [
  { label: 'Intramuscular', value: 'Intramuscular' },
  { label: 'Subcutánea', value: 'Subcutánea' },
  { label: 'Intravenosa', value: 'Intravenosa' },
  { label: 'Oral', value: 'Oral' },
  { label: 'Tópica', value: 'Tópica' },
];

export const opcionesTipoParasito = [
  { label: 'Interno', value: 'Interno' },
  { label: 'Externo', value: 'Externo' },
  { label: 'Ambos', value: 'Ambos' },
];

export const opcionesEstadoEnfermedad = [
  { label: 'Resuelta', value: 'Resuelta' },
  { label: 'Crónica', value: 'Crónica' },
  { label: 'Recurrente', value: 'Recurrente' },
];

export const opcionesGravedad = [
  { label: 'Leve', value: 'Leve' },
  { label: 'Moderada', value: 'Moderada' },
  { label: 'Severa', value: 'Severa' },
];

export const opcionesRiesgoRecurrencia = [
  { label: 'Bajo', value: 'Bajo' },
  { label: 'Medio', value: 'Medio' },
  { label: 'Alto', value: 'Alto' },
];

export const camposBasicos = [
  { key: 'ID o código', required: true, placeholder: 'Ej: BOV-001' },
  { key: 'Nombre', required: true, placeholder: 'Ej: Blanquita' },
  { key: 'Raza', required: false, placeholder: 'Ej: Holstein' },
  { key: 'Características del animal', required: false, placeholder: 'Ej: Blanco con negro, mancha en lomo' },
];

export const camposFechas = [
  { key: 'Fecha de nacimiento', required: false, placeholder: 'YYYY-MM-DD', type: 'date' },
  { key: 'Fecha de ingreso al hato', label: 'Fecha de ingreso al hato (opcional)', required: false, placeholder: 'YYYY-MM-DD', type: 'date' },
];