export function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function calculateCheckDigit(digits: string, weights: number[]): number {
  const sum = digits
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstCheckDigit = calculateCheckDigit(digits.slice(0, 12), firstWeights);
  if (firstCheckDigit !== Number(digits[12])) return false;

  const secondCheckDigit = calculateCheckDigit(digits.slice(0, 13), secondWeights);
  if (secondCheckDigit !== Number(digits[13])) return false;

  return true;
}
