export interface Vacina {
  id: number;
  nome: string;
  fabricante: string | null;
  dataAplicacao: string;
  dataValidade: string | null;
  animalId: number;
  clinicaCnpj: string;
  animal?: {
    id: number;
    nome: string;
    especie: string | null;
    tutor?: {
      cpf: string;
      usuario?: {
        nome: string;
      };
    };
  };
}

export interface VacinaResponse {
  success: boolean;
  data?: Vacina;
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

