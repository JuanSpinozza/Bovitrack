import { Animal } from "../types/Animal";


export const calcularEdadYCategoria = (animal: Animal) => {
  const fechaNac = new Date(animal.fechaNacimiento);
  const hoy = new Date();

  // Calcular edad en meses
  const edadMeses =
    (hoy.getFullYear() - fechaNac.getFullYear()) * 12 +
    (hoy.getMonth() - fechaNac.getMonth());

  // Calcular edad en años (opcional)
  const edadAnios = edadMeses / 12;

  let categoria = "";

  if (animal.sexo === "Macho") {
    if (edadMeses <= 6) categoria = "Ternero";
    else if (edadMeses <= 12) categoria = "Levante";
    else if (edadMeses <= 36) categoria = "Novillo";
    else if (edadMeses <= 48) categoria = "Toro joven";
    else categoria = "Toro adulto";
  } else if (animal.sexo === "Hembra") {
    if (edadMeses <= 6) categoria = "Ternera";
    else if (edadMeses <= 24) categoria = "Novilla";
    else if (edadMeses <= 36) categoria = "Vaca primeriza";
    else categoria = "Vaca adulta";
  }

  return {
    edadMeses,
    edadAnios: parseFloat(edadAnios.toFixed(1)),
    categoria,
  };
};