import { ChatService } from "./repositories/ChatRepo";
import { DiagnosisService } from "./repositories/DiagnosisRepo";
import { UserService } from "./repositories/UserRepo";
import { VotingService } from "./repositories/VotingRepo";

const db = {
  users: new UserService(),
  diagnoses: new DiagnosisService(),
  votings: new VotingService(),
  chats: new ChatService(),
};

export { db };

