export type UserRole = 'admin' | 'funcionario' | 'tutor';

export interface Usuario {
  cpf: string;
  nome: string;
  email: string;
  dataCadastro: string;
}


