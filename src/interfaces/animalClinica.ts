import type { Animal } from './animal';

export interface AnimalClinicaItem {
  animalId: number;
  clinicaCnpj: string;
  animal?: Animal;
}

