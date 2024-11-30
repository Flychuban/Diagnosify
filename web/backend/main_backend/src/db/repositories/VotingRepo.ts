import { PrismaClient, Vote } from "@prisma/client";
import { boolToString } from "../../utils/boolToString";

const THRESHOLD_IN_PERCENTAGES_TO_BE_MET = 60;
const WHEN_TO_CHECK_VOTES = 3;

const prisma = new PrismaClient()

export class VotingService {
  /**
   *
   * @param diagnosisId
   * @param vote
   *
   *  this method is used when we want to directly mark a diagnosis prediction as true or false
   */
  async label(diagnosisId: number, vote: boolean): Promise<void> {
    try {
      await prisma.diagnosis.update({
        where: { id: diagnosisId },
        data: { is_correct: vote},
      });
    } catch (e) {
      throw new Error(`Error labeling diagnosis: ${e.message}`);
    }
  }

  async vote(
    votingId: number,
    userId: number,
    vote: boolean,
  ): Promise<void> {
    try {
      const voting = await prisma.voting.findFirst({
        where: {
          id: votingId,
        },
        include: {
          votes: true
        } 
      })

      if (voting?.votes.some(vote => { return vote.userId === userId })) {
        throw new Error('User already voted, cant change vote');
      }

      if (voting?.is_closed === true) {
        throw new Error('Voting is already closed');
      }
     
      const newVote = await prisma.vote.create({
        data: {
          userId: userId,
          votingId: votingId,
          vote: boolToString(vote),
        }
      })

      await prisma.voting.update({
        where: { id: votingId },
        data: {
          votes: {
            connect: { id: newVote.id }, 
          },
        },
      });


    } catch (error) {
      throw new Error(`Error voting: ${error.message}`);
    }
  }

  async getUserVote(votingId: string, userId: string): Promise<null | Vote> {
    try {
      const voting = await prisma.voting.findFirst({
        where: {
          id: parseInt(votingId),
        },
        include: {
          votes: {
            where: {
              userId: parseInt(userId),
            },
          },
        },
      });

      if (voting === null) {
        return null
      }

      if (voting?.votes.length === 0) {
        return null;
      }

      return voting.votes[0];
    } catch (error) {
      throw new Error(`Error getting user vote: ${error.message}`);
    }
  }


}
