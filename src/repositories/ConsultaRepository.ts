import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Consulta, ConsultaResponse, ApiListResponse } from '@/interfaces/consulta';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class ConsultaRepository {
  async createConsulta(payload: Omit<Consulta, 'id'>): Promise<ConsultaResponse> {
    return client.request<ConsultaResponse>('/consultas', 'POST', payload, true);
  }

  async getById(id: number): Promise<ConsultaResponse> {
    return client.request<ConsultaResponse>(`/consultas/${id}`, 'GET', undefined, true);
  }

  async getAll(): Promise<ApiListResponse<Consulta>> {
    return client.request<ApiListResponse<Consulta>>('/consultas', 'GET', undefined, true);
  }

  async getByAnimalId(animalId: number): Promise<ApiListResponse<Consulta>> {
    return client.request<ApiListResponse<Consulta>>(`/consultas/animal/${animalId}`, 'GET', undefined, true);
  }

  async getByFuncionarioCpf(funcionarioCpf: string): Promise<ApiListResponse<Consulta>> {
    return client.request<ApiListResponse<Consulta>>(`/consultas/funcionario/${funcionarioCpf}`, 'GET', undefined, true);
  }

  async update(id: number, payload: Partial<Consulta>): Promise<ConsultaResponse> {
    return client.request<ConsultaResponse>(`/consultas/${id}`, 'PUT', payload, true);
  }

  async delete(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/consultas/${id}`, 'DELETE', undefined, true);
  }
}

