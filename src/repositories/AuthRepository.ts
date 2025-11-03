import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { LoginRequest, LoginResponse, RegisterFuncionarioRequest, RegisterTutorRequest } from '@/interfaces/auth';

const client = new HttpClient({ baseUrl: ENV.AUTH_API_BASE_URL });

export class AuthRepository {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    return client.request<LoginResponse>('/auth/login', 'POST', payload);
  }

  async registerFuncionario(payload: RegisterFuncionarioRequest): Promise<{ id?: string } & Record<string, unknown>> {
    return client.request('/auth/register/funcionario', 'POST', payload);
  }

  async registerTutor(payload: RegisterTutorRequest): Promise<{ id?: string } & Record<string, unknown>> {
    return client.request('/auth/register/tutor', 'POST', payload);
  }
}


