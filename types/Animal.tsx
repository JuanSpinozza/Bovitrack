export interface AnimalBase {
  id?: string;
  codigo: string;
  nombre: string;
  raza: string;
  caracteristicas: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  pesoActual: string;
  fechaUltimoPesaje: string;
  estadoSalud: string;
  loteActual: string;
  encargado: string;
  fechaIngresoHato: string;

  condicionCorporal: number;
  proposito: string;

  sexo: "Macho" | "Hembra";
  fechaRegistro: any;
  fechaActualizacion?: any;
}

export interface CamposReproductivosHembra {
  estadoReproductivo?: string;
  fechaUltimoCelo?: string;
  fechaServicio?: string;
  idToro?: string;
  numeroPartos?: string;
  fechaUltimoParto?: string;
}

export interface RegistroVacuna { /* ... */ }
export interface RegistroDesparasitacion { /* ... */ }
export interface RegistroTratamiento { /* ... */ }
export interface RegistroEnfermedad { /* ... */ }
export interface RegistroPeso { /* ... */ }

export interface Animal extends AnimalBase, CamposReproductivosHembra {
  vacunas: RegistroVacuna[];
  desparasitaciones: RegistroDesparasitacion[];
  tratamientos: RegistroTratamiento[];
  enfermedades: RegistroEnfermedad[];
  registrosPeso: RegistroPeso[];
}
