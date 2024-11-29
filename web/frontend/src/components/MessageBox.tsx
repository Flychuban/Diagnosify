import axios from "axios";
import { useState } from "react";
import { Message } from "~/types/apiTypes";
import { MsgHider } from "./universal_components/msgHider";
import { SendHorizontal } from "lucide-react";

export const MessageBox: React.FC<{
  chatId: number;
  userId: number;
  isReply: boolean;
  msgWeAreReplyingTo: Message | null;
}> = ({ chatId, userId, isReply, msgWeAreReplyingTo }) => {
  const [msg, setMsg] = useState("");

  return (
    <div className="flex flex-col space-y-4 p-6 bg-primary rounded-lg shadow-md w-[100vw]">
      <form
        className="flex flex-col space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label
          htmlFor="messageInput"
          className="text-sm font-semibold text-primarytext"
        >
          Enter your message
        </label>
        <input
          id="messageInput"
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-secondary focus:outline-none"
        />
      </form>

      {msgWeAreReplyingTo && (
        <div className="flex flex-col space-y-2">
          <div className="h-px w-full bg-gray-200" />
          <span className="text-xs font-medium text-primarytext">Replying to:</span>
          <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-700 shadow-inner">
            <MsgHider msg={msgWeAreReplyingTo.content} />
          </div>
          <div className="h-px w-full bg-gray-200" />
        </div>
      )}

      <button
        onClick={async () => {
          if (isReply) {
            if (msgWeAreReplyingTo === null) {
              throw new Error("No message to reply to");
            }
            await axios.post(
              `http://localhost:3003/diag/chat/${chatId}/reply`,
              {
                userId: userId,
                idOfMsgWeAreReplyinTo: msgWeAreReplyingTo.id,
                msgContent: msg,
              }
            );
          } else {
            await axios.post(
              `http://localhost:3003/diag/chat/${chatId}/message`,
              {
                userId: userId,
                message: msg,
              }
            );
          }
        }}
        className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <SendHorizontal className="h-4 w-4 mr-2" />
        <span>Send</span>
      </button>
    </div>
  );
};

