export interface Tutor {
  cpf: string;
  telefone: string | null;
  endereco: string | null;
  usuario?: {
    cpf: string;
    nome: string;
    email: string;
  };
}

export interface TutorClinicaItem {
  tutorCpf: string;
  clinicaCnpj: string;
  tutor?: Tutor;
}

export interface TutorResponse {
  success: boolean;
  data?: { cpf: string };
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  count?: number;
  message?: string;
  error?: string;
}


