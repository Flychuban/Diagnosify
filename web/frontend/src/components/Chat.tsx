import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { Message, Chat, User } from "~/types/apiTypes";
import { cookies } from "~/utils/cookies";
import { anotherTimeLimitedProxy, Statuses, timelimitedProxy } from "~/singletons/requestSender";
import { useGetAuthToken } from "~/hooks/cookieGetter";
import { useExecuteRequest } from "~/hooks/requestHook";
import { ComponentReliantOnRequest, ComponentReliantOnRequestWrapper } from "./universal_components/CompoentReliantOnARequestWrapper";
import { MessageBox } from "./MessageBox";
import { Vote, Voting } from "~/utils/api/types";
import { useTraceUpdate } from "~/hooks/debug/checkPropCausingRerender";

type apiResponse<T> = T | { errMsg: string };

function useGetState<T>(functionToFetchState: () => Promise<apiResponse<T>>): apiResponse<T> {
    const [state, setState] = useState<apiResponse<T>>({ errMsg: "Data hasn't been fetched yet" });

    useEffect(() => {
        setInterval(() => {
            timelimitedProxy.send<apiResponse<T>>(async () => { const res = await functionToFetchState(); return res }).then((data => {
                if (data === Statuses.BUSY) {
                    return
                }

                setState(data);
            })).catch(e => { })
        },5000 )

        
    }, [functionToFetchState]);

    return state;
}

type FullChat = Chat & { messages: (Message & { user: User,MsgWeAreReplyingTo: Message & User})[] };
type FullMessage = Message & { user: User, MsgWeAreReplyingTo: Message & User };
type chatQueryOptions = {
    chatId?: number;
    diagnosisId?: number;
}


async function getVoting(chatId: number) {
    return anotherTimeLimitedProxy.send<{ voting: Voting }>(async () => {
        return (await axios.get<{
            voting: Voting
        }>(`http://localhost:3003/diag/voting/chat/${chatId}`)).data
    })
}

async function getUserVote(identifier: chatQueryOptions, userId: number): Promise<{vote : Vote | null}> {
    if (identifier.chatId === null || identifier.chatId === undefined) {
        throw new Error("chatId is null")
    }
    const voting = await getVoting(identifier.chatId)
    console.log("voting data", voting)
    const res = await anotherTimeLimitedProxy.send<{vote: Vote}>(async () => {return (await axios.get<{vote: Vote}>(`http://localhost:3003/diag/voting/${1}/${userId}`)).data})
    console.log("vite",res)
    if (res.vote) {
        return res
    }
    return {vote: null}
}
const Msg: React.FC<{ idOfUserViewingThePage: number; msg: FullMessage, setSelectedMsg: () => void }> = ({ msg, idOfUserViewingThePage, setSelectedMsg }) => {
    const isCurrentUser = idOfUserViewingThePage === msg.user.id;

    // Determine styling classes dynamically
    const messageClassNames = [
        "p-3 mb-3 rounded-lg shadow-md",
        isCurrentUser ? "bg-blue-500 text-white self-end" : "bg-gray-100 text-black self-start",
        "border border-gray-300 max-w-[70%]",
        "transition-transform duration-150 ease-in-out",
    ].join(" ");

    const replyMessageClassNames = [
        "bg-gray-200 p-2 text-sm italic text-gray-600 mb-2 border-l-4 border-blue-300",
    ].join(" ");

    return (
        <ComponentReliantOnRequestWrapper isLoading={false} error={null}>
            <div className="flex flex-col">
                {msg.MsgWeAreReplyingTo && (
                    <div className={replyMessageClassNames}>
                        <p>Replied to: {msg.MsgWeAreReplyingTo.content}</p>
                    </div>
                )}
                <div className={messageClassNames}>
                    <div className="flex items-baseline justify-between">
                        <strong>
                            {isCurrentUser ? "You" : msg.user.username}
                        </strong>
                        <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm mt-1">{msg.content}</p>
                    <button
                        onClick={setSelectedMsg}
                        className="mt-2 text-xs text-primary hover:underline"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </ComponentReliantOnRequestWrapper>
    );
};


async function getDiagnosisReviewChat(diagnosisID: number): Promise<{ chat: FullChat } | { errMsg: string }> {
    try {
        const res = await axios.get<{ chat: FullChat } | { errMsg: string }>(
            `http://localhost:3003/diag/chat?diagnosisID=${diagnosisID}`
        );
        return res.data;
    } catch (error) {
        return { errMsg: error.message };
    }
}

export const ChatComponent: React.FC<{ diagnosisId: number }> = ({ diagnosisId }) => {
    useTraceUpdate(diagnosisId)
    console.log("rerendering")
    const authToken = useGetAuthToken() 
    const [selectedMsgIndex, setSelectedMsgIndex] = useState<number | null>(null)
    const chat = useGetState<{ chat: FullChat }>(() => getDiagnosisReviewChat(diagnosisId));

    if ("errMsg" in chat) {
        return <div>Error: {chat.errMsg}</div>;
    }

    if (authToken?.userId === null || authToken?.userId === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {authToken && chat.chat.messages.map((msg, idx) => (
                <Msg idOfUserViewingThePage={authToken.userId} key={idx} msg={msg} setSelectedMsg={() => {setSelectedMsgIndex(idx)}}/>
            ))}
            <MessageBox
                chatId={chat.chat.id}
                userId={authToken?.userId}
                msgWeAreReplyingTo={
                    selectedMsgIndex !== null && selectedMsgIndex <= chat.chat.messages.length - 1 && chat.chat.messages
                    ? (chat.chat.messages[selectedMsgIndex] ?? null)
                    : null
                }
                isReply={selectedMsgIndex!== null}
            />
        </div>
    );
};
