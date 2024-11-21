import React, { useEffect } from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-4xl font-bold">
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0s" }}
        >
          L
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.1s" }}
        >
          o
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.2s" }}
        >
          a
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.3s" }}
        >
          d
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.4s" }}
        >
          i
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.5s" }}
        >
          n
        </span>
        <span
          className="animate-loading inline-block"
          style={{ animationDelay: "0.6s" }}
        >
          g
        </span>
      </div>
      {/* <style> //! causes hydration error
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-loading {
            animation: bounce 0.5s infinite;
          }
        `}
      </style> */}
    </div>
  );
};

export default Loading;
