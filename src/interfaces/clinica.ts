export interface CreateClinicaRequest {
  cnpj: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  administradorCpf: string;
}

export interface Clinica {
  cnpj: string;
  nome: string;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  dataCadastro: string;
  administradorCpf: string | null;
}

export interface ClinicaResponse {
  success: boolean;
  data?: Clinica;
  message?: string;
  error?: string;
}


