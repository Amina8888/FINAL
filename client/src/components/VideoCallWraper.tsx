import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import VideoCall from "../pages/VideoCall";

const VideoCallWrapper: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isCaller = searchParams.get("caller") === "true";

  if (!token || !id) return <div className="p-8 text-center">Unauthorized</div>;

  return <VideoCall accessToken={token} roomId={id} isCaller={isCaller} />;
};

export default VideoCallWrapper;

