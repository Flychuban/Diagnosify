import { Chat, Message, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient()
export class ChatService {
  // Fetch a chat by chatId or diagnosisId
  async getChat(
    chatId?: number,
    diagnosisId?: number,
  ): Promise<
    | (Chat & {
        messages: (Message & { user: User; messageWeAreRepyingTo: Message })[];
      })
    | null
    | undefined
  > {
    const additionalFieldsForChatPrismaQuery = {
      messages: {
        include: {
          user: true,
          MsgWeAreReplyingTo: true,
        },
      },
    };

    try {
      if (chatId) {
        return await prisma.chat.findUnique({
          where: { id: chatId },
          include: additionalFieldsForChatPrismaQuery,
        });
      }

      if (diagnosisId) {
        const diagnosis = await prisma.diagnosis.findUnique({
          where: { id: diagnosisId },
          include: {
            chat: {
              include: additionalFieldsForChatPrismaQuery,
            },
          },
        });

        return diagnosis?.chat;
      }

      throw new Error('Either chatId or diagnosisId must be provided');
    } catch (error) {
      throw new Error(`Error fetching chat: ${error.message}`);
    }
  }

  async reply(chatId: number,message: string, idOfMsgWeReplyingTo: number, userId: number) {
    return await prisma.message.create({
      data: {
        content: message,
        userId: userId,
        chatId: chatId,
        idOfMessageThisMsgIsReplyingTo: idOfMsgWeReplyingTo
      },
    })
  }
  // Create a new chat for a diagnosis
  async createChat(diagnosisId: number) {
    try {
      const diagnosis = await prisma.diagnosis.findUnique({
        where: { id: diagnosisId },
        include: {
          chat: true,
        },
      });

      if (diagnosis?.chat) {
        throw new Error(
          `Chat for diagnosis with id ${diagnosisId} already exists`,
        );
      }

      return await prisma.chat.create({
        data: {
          diagnosis: { connect: { id: diagnosisId } }, // Connect the chat to the diagnosis
        },
      });
    } catch (error) {
      throw new Error(`Error creating chat: ${error.message}`);
    }
  }

  // Create a new message in a chat
  async createMessage(chatId: number, messageContent: string, userId: number) {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: true,
        },
      });

      if (!chat) {
        throw new Error(`Chat with id ${chatId} not found`);
      }

      return await prisma.message.create({
        data: {
          user: { connect: { id: userId } },
          content: messageContent,
          chat: { connect: { id: chatId } },
        },
      });
    } catch (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }
  }

  // Delete a chat by chatId
  async deleteChat(chatId: number) {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new Error(`Chat with id ${chatId} not found`);
      }

      await prisma.chat.delete({
        where: { id: chatId },
      });

      return { message: `Chat with id ${chatId} has been deleted` };
    } catch (error) {
      throw new Error(`Error deleting chat: ${error.message}`);
    }
  }

  // Delete a message by messageId
  async deleteMessage(messageId: number) {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new Error(`Message with id ${messageId} not found`);
      }

      await prisma.message.delete({
        where: { id: messageId },
      });

      return { message: `Message with id ${messageId} has been deleted` };
    } catch (error) {
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }

  // List all messages for a chat
  async listMessages(chatId: number): Promise<(Message & { user: User })[]> {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!chat) {
        throw new Error(`Chat with id ${chatId} not found`);
      }

      return chat.messages;
    } catch (error) {
      throw new Error(`Error listing messages: ${error.message}`);
    }
  }
}
