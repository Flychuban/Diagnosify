import { IMessageBroker, messageBroker } from '../utils/messagequeue';
import { db } from './db/db';

async function processDiagnosisMessage(message: any) {
  try {
    const { userId, newDiagInfo, directVoteWhichSkipsVoting } = message;
    const newDiagnosis = await db.diagnoses.create(userId, newDiagInfo, directVoteWhichSkipsVoting);
  } catch (err) {
    console.error('Error processing message:', err);
  }
}

export async function startConsumer() {
  try {
    await messageBroker.connect();
    await messageBroker.consumeMessages('diagnosis_queue', processDiagnosisMessage);
  } catch (err) {
    console.error('Error starting consumer:', err);
  }
}


