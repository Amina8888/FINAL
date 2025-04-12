import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function VideoCall() {
  const { consultationId } = useParams();
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      alert("Jitsi API не загружен");
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: `Consultation_${consultationId}`,
      parentNode: jitsiContainer.current,
      configOverwrite: { startWithAudioMuted: false },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
      userInfo: {
        displayName: "Пользователь",
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    return () => api.dispose();
  }, [consultationId]);

  return (
    <div className="w-full h-[90vh] bg-black">
      <div ref={jitsiContainer} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
