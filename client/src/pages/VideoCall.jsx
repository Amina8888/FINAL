import axios from "../axios";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5085/hubs/video", {
  path: "/hubs/video",
  transports: ["websocket"],
});

const VideoCall = () => {
  const [remoteId, setRemoteId] = useState("");
  const [connectedId, setConnectedId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();

      socket.on("ReceiveSignal", (fromId, signal) => {
        setConnectedId(fromId);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (signalData) => {
          socket.emit("SendSignal", fromId, JSON.stringify(signalData));
        });
        peer.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
        peer.signal(JSON.parse(signal));
        peerRef.current = peer;
      });
  useEffect(() => {
    if (!remoteId) return;
    axios
      .get(`/chatmessages?withUserId=${remoteId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load chat history", err));
  }, [remoteId]);


      socket.on("ReceiveMessage", (senderName, msg) => {
        setMessages((prev) => [...prev, { sender: senderName, text: msg }]);
      });
    });
  }, []);

  const callUser = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
      peer.on("signal", (signalData) => {
        socket.emit("SendSignal", remoteId, JSON.stringify(signalData));
      });
      peer.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
      peerRef.current = peer;
    });
  };

  const sendMessage = () => {
    if (connectedId && message.trim()) {
      socket.emit("SendMessage", connectedId, "Me", message);
      setMessages((prev) => [...prev, { sender: "Me", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-bold">Video Call</h2>
      <div className="flex gap-4 mb-4">
        <video ref={localVideoRef} className="w-1/2 border rounded" muted></video>
        <video ref={remoteVideoRef} className="w-1/2 border rounded"></video>
      </div>
      <div className="mb-4">
        <input
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          placeholder="Enter remote Connection ID"
          className="border px-2 py-1 rounded mr-2"
        />
        <button onClick={callUser} className="bg-accent text-white px-4 py-2 rounded">
          Call
        </button>
      </div>

      {/* Chat Interface */}
      <div className="border rounded p-4 max-w-xl bg-white">
        <h3 className="font-semibold mb-2">Chat</h3>
        <div className="h-40 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx}><strong>{msg.sender}:</strong> {msg.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-grow border rounded px-2 py-1"
          />
          <button onClick={sendMessage} className="bg-primary text-white px-4 py-1 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
