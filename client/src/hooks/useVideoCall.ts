import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";

export function useVideoCall(accessToken: string, roomId: string, isCaller: boolean) {
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [callStarted, setCallStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initConnection = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl(`/videoCallHub?roomId=${roomId}`, {
            accessTokenFactory: () => accessToken,
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        connectionRef.current = conn;

        conn.on("ReceiveOffer", async (offer: any) => {
          const pc = peerConnectionRef.current;
          if (!pc) return;
        
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await conn.invoke("SendAnswer", roomId, answer);
        });
        
        conn.on("ReceiveAnswer", async (answer: any) => {
          const pc = peerConnectionRef.current;
          if (!pc) return;
        
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });
        
        conn.on("StartAsCaller", () => {
          if (!isCaller) {
            const pc = peerConnectionRef.current;
            if (pc) {
              pc.createOffer().then(offer => {
                pc.setLocalDescription(offer);
                conn.invoke("SendOffer", roomId, offer);
              });
            }
          }
        });

        conn.on("ReceiveIceCandidate", async (candidate: any) => {
          const pc = peerConnectionRef.current;
          if (!pc) return;
        
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        await conn.start();
        console.log("🔌 SignalR connection started");
        setConnectionStatus("Connected");

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            conn.invoke("SendSignal", roomId, event.candidate);
          }
        };

        if (isCaller) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await conn.invoke("SendOffer", roomId, offer);
        }

        setCallStarted(true);
      } catch (err: any) {
        console.error("🚨 Connection error:", err);
        setError(err.message);
        setConnectionStatus("Failed");
      }
    };

    initConnection();

    return () => {
      peerConnectionRef.current?.close();
      connectionRef.current?.stop();
    };
  }, [accessToken, roomId, isCaller]);

  const endCall = async () => {
    peerConnectionRef.current?.close();
    connectionRef.current?.stop();
    setCallStarted(false);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    connectionStatus,
    callStarted,
    endCall,
    error,
  };
}

