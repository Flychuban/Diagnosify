import { PrismaClient, Diagnosis, User } from '@prisma/client';

const prisma = new PrismaClient();
const THRESHOLD_IN_PERCENTAGES_TO_BE_MET = 60;
const WHEN_TO_CHECK_VOTES = 3;

export interface IDB {
  getUserDiagnoses(userId: number): Promise<Diagnosis[]>;
  createDiagnosis(userId: number, data: object): Promise<Diagnosis>;
  getDiagnosesForModelTraining(): Promise<object[]>;
  getAllDiagnoses(): Promise<Diagnosis[]>;
  getDiagnosis(diagnosisId: number): Promise<Diagnosis>;
  vote(diagnosisId: number, userId: number, vote: boolean): Promise<void>;
  createUser(userId: number, username: string): Promise<any>;
}

export class DB implements IDB {
  async createDiagnosis(userId: number, data: object): Promise<Diagnosis> {
    try {
      const newDiagnosis = await prisma.diagnosis.create({
        data: {
          type: data.type,
          userId: userId,
          raw_data: data.raw_data,
          prediction: data.label,
          voting: {
            create: {
              yes: 0,
              no: 0,
            },
          },
        },
        include: { voting: true },
      });

      return newDiagnosis;
    } catch (error) {
      throw new Error(`Error creating diagnosis: ${error.message}`);
    }
  }

  async getUserDiagnoses(userId: number): Promise<Diagnosis[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { diagnoses: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user.diagnoses;
    } catch (error) {
      throw new Error(`Error fetching user diagnoses: ${error.message}`);
    }
  }

  async getDiagnosesForModelTraining(): Promise<object[]> {
    try {
      const diagnoses = await prisma.diagnosis.findMany({
        where: {
          is_correct: {
            not: null,
          },
        },
      });

      return diagnoses;
    } catch (error) {
      throw new Error(
        `Error fetching diagnoses for model training: ${error.message}`,
      );
    }
  }

  async getAllDiagnoses(): Promise<Diagnosis[]> {
    try {
      return await prisma.diagnosis.findMany();
    } catch (error) {
      throw new Error(`Error fetching all diagnoses: ${error.message}`);
    }
  }

  async getDiagnosis(diagnosisId: number): Promise<Diagnosis> {
    try {
      const diagnosis = await prisma.diagnosis.findUnique({
        where: { id: diagnosisId },
        include: {
          voting: {
            include: {
              voters: true,
            },
          },
        },
      });

      return diagnosis;
    } catch (error) {
      throw new Error(`Error fetching diagnosis: ${error.message}`);
    }
  }

  async vote(
    diagnosisId: number,
    userId: number,
    vote: boolean,
  ): Promise<void> {
    try {
      const existingVote = await prisma.voting.findUnique({
        where: { diagnosisId: diagnosisId },
        include: { diagnosis: true, voters: true },
      });

      if (!existingVote) {
        throw new Error('Voting not found');
      }

      if (existingVote.voters.some((voter) => voter.id === userId)) {
        throw new Error('Voter has already voted');
      }

      const updateData = vote
        ? { yes: existingVote.yes + 1 }
        : { no: existingVote.no + 1 };

      await prisma.voting.update({
        where: { diagnosisId: diagnosisId },
        data: updateData,
      });

      const totalVotes = existingVote.yes + existingVote.no + 1;
      if (totalVotes >= WHEN_TO_CHECK_VOTES) {
        const yesPercentage = (existingVote.yes / totalVotes) * 100;
        const noPercentage = (existingVote.no / totalVotes) * 100;

        if (
          yesPercentage >= THRESHOLD_IN_PERCENTAGES_TO_BE_MET ||
          noPercentage >= THRESHOLD_IN_PERCENTAGES_TO_BE_MET
        ) {
          await this.verifyDiagnosis(
            diagnosisId,
            existingVote.yes > existingVote.no,
          );
        }
      }

      await prisma.voting.update({
        where: { diagnosisId: diagnosisId },
        data: { voters: { connect: { id: userId } } },
      });
    } catch (error) {
      throw new Error(`Error voting: ${error.message}`);
    }
  }

  async verifyDiagnosis(diagnosisId: number, isCorrect: boolean) {
    try {
      await prisma.diagnosis.update({
        where: { id: diagnosisId },
        data: { is_correct: isCorrect },
      });
    } catch (error) {
      throw new Error(`Error verifying diagnosis: ${error.message}`);
    }
  }

  async createUser(userId: number, username: string): Promise<any> {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          id: userId,
        },
      });
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}

const db = new DB();
export { db };
