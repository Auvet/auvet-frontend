export interface Consulta {
  id: number;
  data: string;
  hora: string;
  motivo: string | null;
  status: string;
  observacoes: string | null;
  animalId: number;
  funcionarioCpf: string;
  clinicaCnpj: string;
  animal?: {
    id: number;
    nome: string;
    especie: string | null;
    raca: string | null;
    tutor?: {
      cpf: string;
      usuario?: {
        nome: string;
      };
    };
  };
  funcionario?: {
    cpf: string;
    cargo: string;
    usuario?: {
      nome: string;
    };
  };
}

export interface ConsultaResponse {
  success: boolean;
  data?: Consulta;
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

