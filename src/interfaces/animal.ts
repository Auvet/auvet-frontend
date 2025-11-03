export interface Animal {
  id: number;
  nome: string;
  especie: string | null;
  raca: string | null;
  sexo: string | null;
  idade: number | null;
  peso: number | null;
  tutorCpf: string;
  tutor?: {
    cpf: string;
    telefone: string | null;
    endereco: string | null;
    usuario?: {
      cpf: string;
      nome: string;
      email: string;
    };
  };
}

export interface AnimalResponse {
  success: boolean;
  data?: Animal;
  message?: string;
  error?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  count?: number;
  message?: string;
  error?: string;
}

