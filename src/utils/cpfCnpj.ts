export function cleanCPF(cpf: string): string {
  return cpf.replace(/[^\d]/g, '');
}

export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, '');
}

export function validateCPF(cpf: string): { isValid: boolean; error?: string } {
  if (!cpf || typeof cpf !== 'string') {
    return { isValid: false, error: 'CPF é obrigatório' };
  }

  const cleanCPFValue = cleanCPF(cpf);

  if (cleanCPFValue.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }

  if (/^(\d)\1{10}$/.test(cleanCPFValue)) {
    return { isValid: false, error: 'CPF inválido (dígitos repetidos)' };
  }

  if (cleanCPFValue === '00000000000') {
    return { isValid: false, error: 'CPF inválido' };
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPFValue.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) {
    digit1 = 0;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPFValue.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) {
    digit2 = 0;
  }

  if (parseInt(cleanCPFValue.charAt(9)) !== digit1 || parseInt(cleanCPFValue.charAt(10)) !== digit2) {
    return { isValid: false, error: 'CPF inválido (dígitos verificadores incorretos)' };
  }

  return { isValid: true };
}

export function validateCNPJ(cnpj: string): { isValid: boolean; error?: string } {
  if (!cnpj || typeof cnpj !== 'string') {
    return { isValid: false, error: 'CNPJ é obrigatório' };
  }

  const cleanCNPJValue = cleanCNPJ(cnpj);

  if (cleanCNPJValue.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }

  if (/^(\d)\1{13}$/.test(cleanCNPJValue)) {
    return { isValid: false, error: 'CNPJ inválido (dígitos repetidos)' };
  }

  let sum = 0;
  let weight = 5;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJValue.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let digit1 = sum % 11;
  digit1 = digit1 < 2 ? 0 : 11 - digit1;

  sum = 0;
  weight = 6;

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJValue.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let digit2 = sum % 11;
  digit2 = digit2 < 2 ? 0 : 11 - digit2;

  if (parseInt(cleanCNPJValue.charAt(12)) !== digit1 || parseInt(cleanCNPJValue.charAt(13)) !== digit2) {
    return { isValid: false, error: 'CNPJ inválido (dígitos verificadores incorretos)' };
  }

  return { isValid: true };
}

export function formatCPF(cpf: string): string {
  const clean = cleanCPF(cpf);
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  const clean = cleanCNPJ(cnpj);
  if (clean.length !== 14) return cnpj;
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

