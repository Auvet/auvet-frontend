export interface Funcionario {
  cpf: string;
  cargo: string;
  registroProfissional: string | null;
  status: string;
  nivelAcesso: number;
}

export interface FuncionarioResponse {
  success: boolean;
  data?: Funcionario;
}


