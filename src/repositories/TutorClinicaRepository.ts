import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { ApiListResponse, TutorClinicaItem } from '@/interfaces/tutor';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class TutorClinicaRepository {
  async listByClinica(cnpj: string): Promise<ApiListResponse<TutorClinicaItem>> {
    return client.request(`/tutor-clinica/clinica/${cnpj}`, 'GET', undefined, true);
  }

  async listByTutor(cpf: string): Promise<ApiListResponse<{ tutorCpf: string; clinicaCnpj: string; clinica?: { cnpj: string; nome: string; email: string | null } }>> {
    return client.request(`/tutor-clinica/tutor/${cpf}`, 'GET', undefined, true);
  }

  async createRelation(tutorCpf: string, clinicaCnpj: string) {
    return client.request(`/tutor-clinica`, 'POST', { tutorCpf, clinicaCnpj }, true);
  }

  async deleteRelation(tutorCpf: string, clinicaCnpj: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return client.request(`/tutor-clinica/tutor/${tutorCpf}/clinica/${clinicaCnpj}`, 'DELETE', undefined, true);
  }
}

