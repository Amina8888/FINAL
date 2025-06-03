import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

export const useChatConnection = (accessToken: string) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef<{ [event: string]: (...args: any[]) => void }>({});

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("/chatHub", {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("SignalR connected");
        setIsConnected(true);
        setConnection(newConnection);
      })
      .catch((err) => console.error("SignalR error:", err));

    return () => {
      newConnection.stop();
    };
  }, [accessToken]);

  const subscribe = (event: string, handler: (...args: any[]) => void) => {
    if (connection && !listenersRef.current[event]) {
      connection.on(event, handler);
      listenersRef.current[event] = handler;
    }
  };

  const sendMessage = async (userId: string, message: string) => {
    if (connection) {
      await connection.invoke("SendMessage", userId, message);
    }
  };

  return { connection, isConnected, sendMessage, subscribe };
};

