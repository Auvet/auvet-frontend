const CNPJ_KEY = 'auvet:cnpj';

let inMemoryToken: string | null = null;

export function saveToken(token: string) {
  inMemoryToken = token;
}

export function getToken(): string | null {
  return inMemoryToken;
}

export function clearToken() {
  inMemoryToken = null;
}

export function saveCnpj(cnpj: string) {
  localStorage.setItem(CNPJ_KEY, cnpj);
}

export function getCnpj(): string | null {
  return localStorage.getItem(CNPJ_KEY);
}

export function clearCnpj() {
  localStorage.removeItem(CNPJ_KEY);
}


