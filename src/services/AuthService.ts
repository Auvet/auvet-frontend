import { AuthRepository } from '@/repositories/AuthRepository';
import { LoginRequest, RegisterFuncionarioRequest, RegisterTutorRequest } from '@/interfaces/auth';
import { saveToken } from '@/utils/storage';
import type { UserRole } from '@/interfaces/user';

export class AuthService {
  private readonly repo: AuthRepository;

  constructor(repo = new AuthRepository()) {
    this.repo = repo;
  }

  async login(credentials: LoginRequest): Promise<{ token: string; role?: UserRole; clinicas?: Array<{ cnpj: string; nome: string; email: string | null }> }> {
    const res = await this.repo.login(credentials);
    const token = res?.data?.token;
    if (token) saveToken(token);

    const tipo = res?.data?.usuario?.tipoUsuario?.toLowerCase();
    const cargo = res?.data?.usuario?.dadosAdicionais?.cargo?.toLowerCase?.();
    let role: UserRole | undefined;
    if (tipo === 'tutor') role = 'tutor';
    else if (tipo === 'funcionario') role = cargo === 'administrador' ? 'admin' : 'funcionario';
    
    return { token, role };
  }

  async registerAdminAndLogin(payload: RegisterFuncionarioRequest): Promise<string> {
    await this.repo.registerFuncionario(payload);
    const res = await this.repo.login({ cpf: payload.cpf, senha: payload.senha });
    const token = res?.data?.token;
    if (!token) throw new Error('Falha ao obter token após registrar administrador');
    saveToken(token);
    return token;
  }

  async registerFuncionario(payload: RegisterFuncionarioRequest): Promise<void> {
    await this.repo.registerFuncionario(payload);
  }

  async registerTutor(payload: RegisterTutorRequest): Promise<void> {
    await this.repo.registerTutor(payload);
  }
}


