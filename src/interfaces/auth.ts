export interface LoginRequest {
  cpf: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    usuario: {
      cpf: string;
      nome: string;
      email: string;
      tipoUsuario: 'funcionario' | 'tutor' | string;
      dadosAdicionais?: {
        cargo?: string;
        [key: string]: unknown;
      };
    };
    permissoes?: Record<string, unknown>;
  };
  message?: string;
}

export interface RegisterFuncionarioRequest {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  registroProfissional?: string;
  nivelAcesso: number;
}

export interface RegisterTutorRequest {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  endereco?: string;
  clinicas: string[];
}


