import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { ApiListResponse, FuncionarioClinicaItem } from '@/interfaces/funcionarioClinica';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class FuncionarioClinicaRepository {
  async listByClinica(cnpj: string): Promise<ApiListResponse<FuncionarioClinicaItem>> {
    return client.request(`/funcionario-clinica/clinica/${cnpj}`, 'GET', undefined, true);
  }

  async listByFuncionario(cpf: string): Promise<ApiListResponse<{ funcionarioCpf: string; clinicaCnpj: string; clinica?: { cnpj: string; nome: string; email: string | null } }>> {
    return client.request(`/funcionario-clinica/funcionario/${cpf}`, 'GET', undefined, true);
  }

  async createRelation(funcionarioCpf: string, clinicaCnpj: string) {
    return client.request(`/funcionario-clinica`, 'POST', { funcionarioCpf, clinicaCnpj }, true);
  }

  async deleteRelation(funcionarioCpf: string, clinicaCnpj: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/funcionario-clinica/funcionario/${funcionarioCpf}/clinica/${clinicaCnpj}`, 'DELETE', undefined, true);
  }
}


