export function validarRequerido(value: string, campo: string): string | null {
  if (!value.trim()) return `${campo} es obligatorio`;
  return null;
}

export function validarTelefono(value: string): string | null {
  if (!value.trim()) return 'Teléfono es obligatorio';
  const soloDigitos = value.replace(/\s|-/g, '');
  if (!/^\d{7,15}$/.test(soloDigitos)) return 'Ingrese un teléfono válido (7-15 dígitos)';
  return null;
}
