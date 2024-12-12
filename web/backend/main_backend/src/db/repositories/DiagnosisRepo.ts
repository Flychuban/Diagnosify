import { PrismaClient, Voting } from '@prisma/client';
import {boolToString} from "../../utils/boolToString"
import { Diagnosis } from '@prisma/client';


export type NewDiagnosisInfo = {
  type: string;
  link_raw_data: string;
  label: string;
  vote: boolean
  description: string
};


const prisma = new PrismaClient();

export class DiagnosisService {

async create(
  userId: number, 
  data: NewDiagnosisInfo, 
  directVoteWhichSkipsVoting: boolean | null
) {

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      const chat = await prisma.chat.create({
        data: {
          messages: {
            create: {
              user: { connect: { id: userId } },
              content: `${user.username} created discussion`,
            },
          },
        },
      });
      console.log("diag",data.description)
      const diag = await prisma.diagnosis.create({
        data: {
          type: data.type,
          userId: userId,
          link_to_data_blob: data.link_raw_data,
          link_to_prediction_info: data.label,
          chatId: chat.id,
          description: data.description === undefined ? null : data.description
        },
      });

      let voting;
      if (directVoteWhichSkipsVoting !== null) {
        voting = await prisma.voting.create({
          data: {
            diagnosisId: diag.id,
            is_closed: true,
            votes: {
              create: {
                userId: userId,
                vote: boolToString(directVoteWhichSkipsVoting),
              },
            },
          },
        });

        await prisma.diagnosis.update({
          where: { id: diag.id },
          data: {
            is_correct: directVoteWhichSkipsVoting,
          },
        });
      } else {
        voting = await prisma.voting.create({
          data: {
            diagnosisId: diag.id,
            is_closed: false,
            votes: {
              create: {
                userId: userId,
                vote: boolToString(data.vote),
              },
            },
          },
        });
      }

      return { diagnosis: diag, voting };
    });

    return result;
  } catch (error) {
    throw new Error(`Error creating diagnosis: ${error.message}`);
  }
}


  async getAll(page: number): Promise<Diagnosis[]> {
    try {
      if (page == 0) {
        return await prisma.diagnosis.findMany()
      }
      return await prisma.diagnosis.findMany({
        skip: (page - 1) * 10, // we do this since if page 1 will skip the first 10 elements
        take: 25 
      });
    } catch (error) {
      throw new Error(`Error fetching all diagnoses: ${error.message}`);
    }
  }

  async get(diagnosisId: number):Promise<(Diagnosis & {voting : (Voting)}) | null> {
    try {
      return await prisma.diagnosis.findUnique({
        where: { id: diagnosisId },
        include: {
          voting: {
            include: {
              votes: {
                include: {
                  user: true
                }
              }
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Error fetching diagnosis: ${error.message}`);
    }
  }

  async getDiagnosesForModelTraining(): Promise<object[]> {
    try {
      return await prisma.diagnosis.findMany({
        where: {
          is_correct: {
            not: null,
          },
        },
      });
    } catch (error) {
      throw new Error(`Error fetching diagnoses for model training: ${error.message}`);
    }
  }

  async verify(diagnosisId: number, isCorrect: boolean) {
    try {
      await prisma.diagnosis.update({
        where: { id: diagnosisId },
        data: { is_correct: isCorrect },
      });
    } catch (error) {
      throw new Error(`Error verifying diagnosis: ${error.message}`);
    }
  }
}
