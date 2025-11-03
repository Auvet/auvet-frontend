import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Funcionario } from '@/interfaces/funcionario';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class FuncionarioRepository {
  async update(cpf: string, data: Partial<Funcionario>): Promise<{ success: boolean; data?: Funcionario; message?: string; error?: string }> {
    return client.request(`/funcionarios/${cpf}`, 'PUT', data, true);
  }
}

