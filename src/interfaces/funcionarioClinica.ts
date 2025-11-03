export interface FuncionarioUsuario {
  cpf: string;
  cargo: string;
  registroProfissional: string | null;
  status: string;
  nivelAcesso: number;
  usuario?: {
    cpf: string;
    nome: string;
    email: string;
  };
}

export interface FuncionarioClinicaItem {
  funcionarioCpf: string;
  clinicaCnpj: string;
  funcionario?: FuncionarioUsuario;
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  count?: number;
  message?: string;
  error?: string;
}


