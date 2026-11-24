// Supuesto del ejercicio: aprobar con 3,95 antes de redondear el promedio a un decimal.
// La institución puede usar otra regla: no es una política oficial de INACAP.
export function requiredGrade(partial, remainingPercent, threshold = 3.95) {
  if (!Number.isFinite(partial) || !Number.isFinite(remainingPercent) || remainingPercent <= 0 || remainingPercent > 100) throw new RangeError('Ponderación inválida');
  return Math.ceil(((threshold - partial) / (remainingPercent / 100)) * 10 - 1e-9) / 10;
}
