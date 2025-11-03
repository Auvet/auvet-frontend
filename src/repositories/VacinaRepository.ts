import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Vacina, VacinaResponse, ApiListResponse } from '@/interfaces/vacina';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class VacinaRepository {
  async createVacina(payload: Omit<Vacina, 'id'>): Promise<VacinaResponse> {
    return client.request<VacinaResponse>('/vacinas', 'POST', payload, true);
  }

  async getById(id: number): Promise<VacinaResponse> {
    return client.request<VacinaResponse>(`/vacinas/${id}`, 'GET', undefined, true);
  }

  async getAll(): Promise<ApiListResponse<Vacina>> {
    return client.request<ApiListResponse<Vacina>>('/vacinas', 'GET', undefined, true);
  }

  async getByAnimalId(animalId: number): Promise<ApiListResponse<Vacina>> {
    return client.request<ApiListResponse<Vacina>>(`/vacinas/animal/${animalId}`, 'GET', undefined, true);
  }

  async update(id: number, payload: Partial<Vacina>): Promise<VacinaResponse> {
    return client.request<VacinaResponse>(`/vacinas/${id}`, 'PUT', payload, true);
  }

  async delete(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/vacinas/${id}`, 'DELETE', undefined, true);
  }
}

