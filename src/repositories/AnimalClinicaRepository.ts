import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';
import type { ApiListResponse } from '@/interfaces/animal';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class AnimalClinicaRepository {
  async listByClinica(cnpj: string): Promise<ApiListResponse<AnimalClinicaItem>> {
    return client.request(`/animal-clinica/clinica/${cnpj}`, 'GET', undefined, true);
  }

  async listByAnimal(animalId: number): Promise<ApiListResponse<AnimalClinicaItem>> {
    return client.request(`/animal-clinica/animal/${animalId}`, 'GET', undefined, true);
  }

  async createRelation(animalId: number, clinicaCnpj: string) {
    return client.request('/animal-clinica', 'POST', { animalId, clinicaCnpj }, true);
  }

  async deleteRelation(animalId: number, clinicaCnpj: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/animal-clinica/animal/${animalId}/clinica/${clinicaCnpj}`, 'DELETE', undefined, true);
  }
}

