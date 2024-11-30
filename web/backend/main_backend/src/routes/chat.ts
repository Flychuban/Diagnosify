import express,{ Express } from "express"
import { db } from "../db/db";
import { Chat, Message, User } from "@prisma/client";
import { CustomResponse } from "../types";
export const chatRouter = express.Router();


chatRouter.get('/', async (req: express.Request, res: express.Response<CustomResponse<{ chat: (Chat & { messages: (Message & {user: User})[]  }) }>>) => {
    const { chatId, diagnosisID } = req.query;
    if (chatId === undefined && diagnosisID === undefined) {
        res.status(400).json({ errMsg: 'Missing both chatId and diagnosisID' });
        return;
    }
    
    if (typeof chatId === 'string') { 
        const chat = await db.chats.getChat(parseInt(chatId), undefined)
        if (chat === null || chat === undefined) {
            res.status(404).json({ errMsg: 'Chat not found' });
            return;
        }
        res.status(201).json({ chat: chat })
    }

    if (typeof diagnosisID === 'string') { 
        const chat = await db.chats.getChat(undefined, parseInt(diagnosisID))
            if (chat === null || chat === undefined) {
            res.status(404).json({ errMsg: 'Chat not found' });
            return;
        }
        res.status(201).json({chat: chat})
    }

})

chatRouter.post("/", async (req: express.Request<{}, {}, { diagnosisId: number }>, res: express.Response<{}>) => {
    try {
        await db.chats.createChat(req.body.diagnosisId)
    } catch (e) {
        res.status(500).json({errMsg: e.message})
    } 
})

chatRouter.post(
    "/:chatId/message",
    async (req: express.Request<{ chatId: string }, {}, { userId: number; message: string }>, res: express.Response<{}>) => { 

    try {
        await db.chats.createMessage(parseInt(req.params.chatId), req.body.message,req.body.userId)
        res.status(201).json({})
    } catch (e) {
        res.status(500).json({errMsg: e.message})
    }
    })

chatRouter.post("/:chatId/reply",
    async (req: express.Request<{ chatId: string }, {}, { userId: number, idOfMsgWeAreReplyingTo: number, msgContent: string }>, res: express.Response<{}>) => {
        try {

            console.log(parseInt(req.params.chatId), req.body.msgContent , req.body.idOfMsgWeAreReplyingTo, req.body.userId)


            await db.chats.reply(parseInt(req.params.chatId), req.body.msgContent , req.body.idOfMsgWeAreReplyingTo, req.body.userId )
            res.status(201).json({})
        } catch (e) { 
            res.status(500).json({errMsg: e.message})
        }
    }
)