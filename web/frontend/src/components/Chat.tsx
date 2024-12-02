import React, { useEffect, useState } from "react";
import type { Message, Chat, User } from "~/types/apiTypes";
import { cookies } from "~/utils/cookies";
import { anotherTimeLimitedProxy, Statuses, timelimitedProxy } from "~/singletons/requestSender";
import { useGetAuthToken } from "~/hooks/cookieGetter";
import { ComponentReliantOnRequestWrapper } from "./universal_components/CompoentReliantOnARequestWrapper";
import { MessageBox } from "./MessageBox";
import { useTraceUpdate } from "~/hooks/debug/checkPropCausingRerender";
import { api } from "~/utils/api/api";

export type FullChat = Chat & {
  messages: (Message & { user: User; MsgWeAreReplyingTo: Message & User })[];
};

type FullMessage = Message & { user: User; MsgWeAreReplyingTo: Message & User };

type apiResponse<T> = T | { errMsg: string };

function useGetState<T>(
  functionToFetchState: () => Promise<apiResponse<T>>
): apiResponse<T> {
  const [state, setState] = useState<apiResponse<T>>({
    errMsg: "Data hasn't been fetched yet",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      timelimitedProxy
        .send<apiResponse<T>>(functionToFetchState)
        .then((data) => {
          if (data !== Statuses.BUSY) {
            setState(data);
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [functionToFetchState]);

  return state;
}

const Msg: React.FC<{
  idOfUserViewingThePage: number;
  msg: FullMessage;
  setSelectedMsg: () => void;
}> = ({ msg, idOfUserViewingThePage, setSelectedMsg }) => {
  const isCurrentUser = idOfUserViewingThePage === msg.user.id;

  return (
    <div
      className={`p-4 mb-3 rounded-lg shadow-md ${
        isCurrentUser
          ? "bg-primary text-white self-end"
          : "bg-secondary text-primarytext self-start"
      }`}
    >
      {msg.MsgWeAreReplyingTo && (
        <div className="mb-2 p-2 text-sm text-primarytext bg-primary border-l-4 border-secondary">
          <p>Replied to: {msg.MsgWeAreReplyingTo.content}</p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <strong className="text-sm">
          {isCurrentUser ? "You" : msg.user.username}
        </strong>
        <span className="text-xs text-gray-400">
          {new Date(msg.createdAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="mt-1 text-sm">{msg.content}</p>
      <button
        onClick={setSelectedMsg}
        className="mt-2 text-xs text-primarytext hover:underline"
      >
        Reply
      </button>
    </div>
  );
};

async function getDiagnosisReviewChat(
  diagnosisID: number
): Promise<{ chat: FullChat } | { errMsg: string }> {
  try {
    return await api.chat.get(diagnosisID);
  } catch (error) {
    return { errMsg: error.message };
  }
}

// ChatComponent
export const ChatComponent: React.FC<{ diagnosisId: number }> = ({
  diagnosisId,
}) => {
  useTraceUpdate(diagnosisId);
  const authToken = useGetAuthToken();
  const [selectedMsgIndex, setSelectedMsgIndex] = useState<number | null>(null);
  const chat = useGetState<{ chat: FullChat }>(() =>
    getDiagnosisReviewChat(diagnosisId)
  );

  if ("errMsg" in chat) {
    return (
      <div className="p-4 text-primarytext bg-primary border-red-400 rounded-md">
        Error: {chat.errMsg}
      </div>
    );
  }

  if (!authToken?.userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-secondary rounded-lg shadow-lg">
      <div className="overflow-y-auto max-h-[50vh] mb-6">
        {chat.chat.messages.map((msg, idx) => (
          <Msg
            idOfUserViewingThePage={authToken.userId}
            key={idx}
            msg={msg}
            setSelectedMsg={() => setSelectedMsgIndex(idx)}
          />
        ))}
      </div>
      <MessageBox
        onRemoveReplyingToMsg={() => setSelectedMsgIndex(null)}
        chatId={chat.chat.id}
        userId={authToken.userId}
        msgWeAreReplyingTo={
          selectedMsgIndex !== null &&
          selectedMsgIndex <= chat.chat.messages.length - 1 &&
          chat.chat.messages
            ? chat.chat.messages[selectedMsgIndex] ?? null
            : null
        }
        isReply={selectedMsgIndex !== null}
      />
    </div>
  );
};

