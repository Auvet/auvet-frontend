import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Usuario } from '@/interfaces/user';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export interface UsuarioResponse {
  success: boolean;
  data?: Usuario;
  message?: string;
  error?: string;
}

export class UsuarioRepository {
  async getByCpf(cpf: string): Promise<UsuarioResponse> {
    return client.request<UsuarioResponse>(`/usuarios/${cpf}`, 'GET', undefined, true);
  }

  async update(cpf: string, data: { nome?: string; email?: string; senha?: string }): Promise<UsuarioResponse> {
    return client.request<UsuarioResponse>(`/usuarios/${cpf}`, 'PUT', data, true);
  }
}

