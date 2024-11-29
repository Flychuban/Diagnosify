import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { Message, Chat, User } from "~/types/apiTypes";
import { cookies } from "~/utils/cookies";
import { Statuses, timelimitedProxy } from "~/singletons/requestSender";
import { useGetAuthToken } from "~/hooks/cookieGetter";
import { useExecuteRequest } from "~/hooks/requestHook";
import { ComponentReliantOnRequest, ComponentReliantOnRequestWrapper } from "./universal_components/CompoentReliantOnARequestWrapper";
import { MessageBox } from "./MessageBox";

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


function getUserVote(identifier: chatQueryOptions, userId: number): Promise<string> {
    return Promise.resolve("")
}

const Msg: React.FC<{ idOfUserViewingThePage: number; msg: FullMessage, setSelectedMsg: () => void}> = ({ msg, idOfUserViewingThePage, setSelectedMsg }) => {
    const isCurrentUser = idOfUserViewingThePage === msg.user.id;
    

    const [voteOfUserMsgIsBelongingTo, isLoading, error] = useExecuteRequest(
    null,
    async () => {
        return await getUserVote({ diagnosisId: 1 }, msg.userId);
    }
  );

  // Determine styling classes dynamically
  const messageClassNames = [
    "p-2 mb-2 rounded border",
    isCurrentUser ? "bg-primary text-primarytext bd-secondary" : "bg-light text-secondary bd-secondary",
  ].join(" ");

  return (
    <ComponentReliantOnRequestWrapper isLoading={isLoading} error={error}>
      <div >
        {msg.MsgWeAreReplyingTo && (
          <div className="mb-2">
            <p>Replied to: {msg.MsgWeAreReplyingTo.content}</p>
          </div>
        )}
        <div className={messageClassNames}>
          <strong>
            {isCurrentUser ? "You" : msg.user.username}: 
            (voted: {voteOfUserMsgIsBelongingTo ?? "loading..."})
          </strong>
                  <p className="text-primarytext">{msg.content}</p>
                  <button onClick={() => {setSelectedMsg()}}>reply</button>
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
