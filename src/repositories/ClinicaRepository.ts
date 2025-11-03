import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { CreateClinicaRequest, Clinica, ClinicaResponse } from '@/interfaces/clinica';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class ClinicaRepository {
  async createClinica(payload: CreateClinicaRequest): Promise<{ id?: string } & Record<string, unknown>> {
    return client.request('/clinicas', 'POST', payload, true);
  }

  async getByCnpj(cnpj: string): Promise<ClinicaResponse> {
    return client.request<ClinicaResponse>(`/clinicas/${cnpj}`, 'GET', undefined, true);
  }

  async update(cnpj: string, data: Partial<Omit<Clinica, 'cnpj' | 'dataCadastro'>>): Promise<ClinicaResponse> {
    return client.request<ClinicaResponse>(`/clinicas/${cnpj}`, 'PUT', data, true);
  }
}


