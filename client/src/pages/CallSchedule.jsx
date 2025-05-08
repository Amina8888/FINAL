
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const CallSchedule = () => {
  const [calls, setCalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/schedule/my")
      .then((res) => setCalls(res.data))
      .catch((err) => console.error("Failed to load schedule", err));
  }, []);

  const startCall = (call) => {
    navigate("/video?target=" + call.SpecialistId);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Scheduled Calls</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Specialist ID</th>
            <th className="p-2">Start Time</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => {
            const start = new Date(call.startTime);
            const now = new Date();
            return (
              <tr key={call.id} className="border-t">
                <td className="p-2">{call.specialistId}</td>
                <td className="p-2">{start.toLocaleString()}</td>
                <td className="p-2">{call.status}</td>
                <td className="p-2">
                  {start <= now && call.status === "Scheduled" ? (
                    <button
                      onClick={() => startCall(call)}
                      className="bg-accent text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Start
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">Not ready</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CallSchedule;
