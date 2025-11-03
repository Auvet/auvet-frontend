import { ENV } from '@/config/env';
import { HttpClient } from '@/utils/httpClient';
import { getToken } from '@/utils/storage';
import type { Tutor } from '@/interfaces/tutor';

const client = new HttpClient({ baseUrl: ENV.BACKEND_API_BASE_URL, getToken });

export class TutorRepository {
  async update(cpf: string, data: Partial<Tutor>): Promise<{ success: boolean; data?: Tutor; message?: string; error?: string }> {
    return client.request(`/tutores/${cpf}`, 'PUT', data, true);
  }
}

