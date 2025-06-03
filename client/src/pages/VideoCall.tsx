import React from "react";
import { useVideoCall } from "@/hooks/useVideoCall";

interface VideoCallProps {
  roomId: string;
  accessToken: string;
  isCaller: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, accessToken, isCaller}) => {
  const {
    localVideoRef,
    remoteVideoRef,
    connectionStatus,
    callStarted,
    endCall,
    error,
  } = useVideoCall(accessToken, roomId, isCaller);

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Video Call — Room ID: {roomId}</h2>

      <div className="flex space-x-4 w-full justify-center">
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-500 mb-1">You</label>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-64 h-48 border rounded bg-black" />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-500 mb-1">Partner</label>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 border rounded bg-black" />
        </div>
      </div>

      <div className="flex space-x-4">
        {callStarted && (
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            End Call
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600">Status: {connectionStatus}</div>
      {error && <div className="text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default VideoCall;

