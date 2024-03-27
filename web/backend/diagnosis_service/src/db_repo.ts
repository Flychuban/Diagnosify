// Import PrismaClient from your generated Prisma client
import { PrismaClient, ModelEnum, User, Diagnosis } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

// Define the IDB interface
export interface IDB {
  get_user_diagnosises(id: number): Promise<Diagnosis[]>;
  create_new_diagnosis(id: number, data: object): Promise<Diagnosis>;
  get_diagnosises_for_model_training(): Promise<void>;
}

// Implement the interface with Prisma
class DB implements IDB {
  async get_user_diagnosises(id: number): Promise<Diagnosis[]> {
    // Implement logic to get user diagnoses from the database using Prisma
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

  async create_new_diagnosis(id: number, data: object): Promise<Diagnosis> {
    // Implement logic to create a new diagnosis for a user in the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const diagnosisData = {
      type: ModelEnum.PNEUMONIA, // Replace with the appropriate ModelEnum value
      userId: user.id,
      raw_data: JSON.stringify(data),
      is_correct: false, // Update this based on your logic
    };
    const new_diagnosis = await prisma.diagnosis.create({
      data: diagnosisData,
    });

    return new_diagnosis;
  }

  async get_diagnosises_for_model_training(): Promise<void> {
    // Implement logic to get diagnoses for model training from the database using Prisma
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        is_correct: true, // Filter based on your logic
      },
    });
    console.log(diagnoses);
  }
}

// Usage
const db = new DB();
export { db, ModelEnum, User, Diagnosis };
