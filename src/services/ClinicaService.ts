import { ClinicaRepository } from '@/repositories/ClinicaRepository';
import { CreateClinicaRequest } from '@/interfaces/clinica';

export class ClinicaService {
  private readonly repo: ClinicaRepository;

  constructor(repo = new ClinicaRepository()) {
    this.repo = repo;
  }

  async createClinica(payload: CreateClinicaRequest) {
    return this.repo.createClinica(payload);
  }
}


