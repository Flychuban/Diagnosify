import { Diagnosis, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();


export class UserService {
  async create(userId: number, username: string): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          username: username,
          id: userId,
        },
      });
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getDiagnoses(userId: number): Promise<Diagnosis[]> {
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

  async get(queryObj: { userId : number | null, username: string | null }): Promise<User | null> {
    if (queryObj.userId === null) {
      
      if (queryObj.username === null) { 
        throw new Error('Either userId or username must be provided');
      }
      
      const user = await prisma.user.findFirst({
      where: {
        username: queryObj.username,
        }
      })

      return user;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: queryObj.userId,
      }
    })
    return user
  }
}
