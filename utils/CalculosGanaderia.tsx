// Condición Corporal (CC)
export const validarCondicionCorporal = (cc: number) => {
  return cc >= 1 && cc <= 5 && (cc * 100) % 25 === 0;
};


// Propósito del Animal
export const validarProposito = (proposito: string) => {
  return ["Cría", "Ceba", "Leche"].includes(proposito);
};

// NO NECESITA CÁLCULO
// Informe de movimientos
// Solo se listan lugares
// ===============================


// Producción de leche
// Promedio por parto
export const calcularPromedioLeche = (
  totalLeche: number,
  diasLactancia: number
) => {
  if (diasLactancia === 0) return 0;
  return totalLeche / diasLactancia;
};


// Días abiertos
export const calcularDiasAbiertos = (
  fechaParto: string | Date,
  fechaConcepcion: string | Date
) => {
  const parto = new Date(fechaParto);
  const concepcion = new Date(fechaConcepcion);

  const ms = concepcion.getTime() - parto.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};


//  Intervalo entre partos
export const calcularIntervaloEntrePartos = (
  fechaPartoAnterior: string | Date,
  fechaPartoActual: string | Date
) => {
  const anterior = new Date(fechaPartoAnterior);
  const actual = new Date(fechaPartoActual);

  const ms = actual.getTime() - anterior.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)); // días
};


// Ganancia diaria de peso (GDP)
export const calcularGDP = (
  pesoInicial: number,
  pesoFinal: number,
  fechaInicial: string | Date,
  fechaFinal: string | Date
) => {
  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaFinal);

  const dias = Math.max(
    1,
    Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (pesoFinal - pesoInicial) / dias;
};


// Requerimiento de Materia Seca (MS)
// 2.5% - 3.5% del peso vivo
export const calcularMS = (peso: number, porcentaje = 0.025) => {
  return peso * porcentaje;
};


// Conversión de MS a forraje verde
export const convertirMSToForrajeVerde = (
  msRequerida: number,
  porcentajeMSForraje: number
) => {
  if (porcentajeMSForraje <= 0) return 0;
  return msRequerida / porcentajeMSForraje;
};
