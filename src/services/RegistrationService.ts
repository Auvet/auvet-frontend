import { AuthService } from '@/services/AuthService';
import { ClinicaService } from '@/services/ClinicaService';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { RegisterFuncionarioRequest } from '@/interfaces/auth';
import { CreateClinicaRequest } from '@/interfaces/clinica';
import { saveCnpj } from '@/utils/storage';

export class RegistrationService {
  private readonly authService: AuthService;
  private readonly clinicaService: ClinicaService;
  private readonly funcionarioClinicaRepo: FuncionarioClinicaRepository;

  constructor(authService = new AuthService(), clinicaService = new ClinicaService()) {
    this.authService = authService;
    this.clinicaService = clinicaService;
    this.funcionarioClinicaRepo = new FuncionarioClinicaRepository();
  }

  async registerAdminThenClinic(admin: RegisterFuncionarioRequest, clinica: CreateClinicaRequest) {
    await this.authService.registerAdminAndLogin(admin);
    const created = await this.clinicaService.createClinica(clinica);
    if (clinica?.cnpj) {
      saveCnpj(clinica.cnpj);
      await this.funcionarioClinicaRepo.createRelation(admin.cpf, clinica.cnpj);
    }
    return created;
  }
}


