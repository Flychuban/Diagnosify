import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { db } from '../src/db_repo'; // Adjust the path to your module
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('DiagnosisService.create', () => {
  beforeAll(async () => {
    // Seed a user with userId = 1 for the test
    await prisma.user.create({
      data: {
        id: 2,
        username: 'TestUser',
      },
    });
  });



  test('should create a new diagnosis for userId = 1', async () => {
    const diagnosisData = {
      type: 'TypeA',
      link_raw_data: 'http://example.com/data',
      label: true,
      vote: true,
    };

    const directVote = false;

    const diagnosis = await db.diagnoses.create(1, diagnosisData, directVote);

    // Validate the created diagnosis
    expect(diagnosis).toBeDefined();
    expect(diagnosis.type).toBe(diagnosisData.type);
    expect(diagnosis.link_to_data_blob).toBe(diagnosisData.link_raw_data);
    expect(diagnosis.userId).toBe(1);

    // Fetch the related chat and validate it
    const chat = await prisma.chat.findUnique({
      where: { id: diagnosis.chatId },
      include: {
        messages: true,
      },
    });

    expect(chat).toBeDefined();
    expect(chat!.messages.length).toBe(1);
    expect(chat!.messages[0].content).toBe('TestUser created discussion');

    // Fetch the voting and validate it
    const voting = await prisma.voting.findUnique({
      where: { diagnosisId: diagnosis.id },
      include: { votes: true },
    });

    expect(voting).toBeDefined();
    expect(voting!.votes.length).toBe(1);
    expect(voting!.votes[0].vote).toBe('true'); // Because `boolToString` converts true to 'true'
  });
});
