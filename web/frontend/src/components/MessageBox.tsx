import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SendHorizontal, MessageCircleHeart } from "lucide-react"; // Update this with the actual import
import { Message } from "~/types/apiTypes";

export const MessageBox: React.FC<{
  chatId: number;
  userId: number;
  isReply: boolean;
  msgWeAreReplyingTo: Message | null;
}> = ({ chatId, userId, isReply, msgWeAreReplyingTo }) => {
  const [msg, setMsg] = useState("");
  const messageBoxRef = useRef<HTMLDivElement>(null);

  // Scroll the message box to the bottom when the message input changes
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [msg]);

  return (
    <div
      className="sticky bottom-0 left-0 w-full p-4 bg-white shadow-lg z-10"
      style={{ backgroundColor: "var(--primary)" }} // or use Tailwind CSS class
    >
      <div
        ref={messageBoxRef}
        className="flex flex-col space-y-4 bg-primary p-6 rounded-lg shadow-md w-full max-w-[90vw] mx-auto"
      >{msgWeAreReplyingTo && (
          <div className="flex flex-col space-y-2">
            <div className="h-px w-full bg-gray-200" />
            <span className="text-xs font-medium text-primarytext">Replying to: { msgWeAreReplyingTo.content}</span>
            <div className="h-px w-full bg-gray-200" />
          </div>
        )}
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
                  idOfMsgWeAreReplyingTo: msgWeAreReplyingTo.id,
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
    </div>
  );
};


