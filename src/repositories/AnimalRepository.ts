import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Animal, AnimalResponse } from '@/interfaces/animal';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class AnimalRepository {
  async createAnimal(payload: Omit<Animal, 'id'>): Promise<AnimalResponse> {
    return client.request<AnimalResponse>('/animais', 'POST', payload, true);
  }

  async getById(id: number): Promise<AnimalResponse> {
    return client.request<AnimalResponse>(`/animais/${id}`, 'GET', undefined, true);
  }

  async getByTutorCpf(tutorCpf: string): Promise<{ success: boolean; data?: Animal[]; count?: number }> {
    return client.request(`/animais/tutor/${tutorCpf}`, 'GET', undefined, true);
  }

  async update(id: number, data: Partial<Animal>): Promise<AnimalResponse> {
    return client.request<AnimalResponse>(`/animais/${id}`, 'PUT', data, true);
  }

  async delete(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/animais/${id}`, 'DELETE', undefined, true);
  }
}

