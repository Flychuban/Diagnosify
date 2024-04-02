import { PrismaClient, ModelEnum, User, Diagnosis } from '@prisma/client';

const prisma = new PrismaClient();

export interface IDB {
  get_user_diagnosises(id: number): Promise<Diagnosis[]>;
  create_new_diagnosis(id: number, data: object): Promise<Diagnosis>;
  get_diagnosises_for_model_training(): Promise<void>;
  get_user(username: string);
}

class DB implements IDB {
  async get_user_diagnosises(id: number): Promise<Diagnosis[]> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { diagnoses: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user.diagnoses);
    return user.diagnoses;
  }

  async verify_diagnosis(id: number, label: boolean) {
    const res = await prisma.diagnosis.update({
      where: {
        id: id,
      },
      data: {
        is_correct: label,
      },
    });
    return res;
  }

  async create_new_diagnosis(id: number, data: object): Promise<Diagnosis> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const diagnosisData = {
      type: ModelEnum.PNEUMONIA,
      userId: user.id,
      raw_data: JSON.stringify(data),
      is_correct: false,
    };
    const new_diagnosis = await prisma.diagnosis.create({
      data: diagnosisData,
    });

    return new_diagnosis;
  }

  async get_diagnosises_for_model_training(): Promise<void> {
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        is_correct: true,
      },
    });
    console.log(diagnoses);
  }

  async get_user(username: string) {
    const user = prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    return user;
  }
}

const db = new DB();
export { db, ModelEnum, User, Diagnosis };
