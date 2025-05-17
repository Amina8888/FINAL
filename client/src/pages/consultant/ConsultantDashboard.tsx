import React, { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ConsultantDashboard: React.FC = () => {
  const { token } = useAuth();
  const [consultant, setConsultant] = useState<any>(null);
  const [nextConsultation, setNextConsultation] = useState<any>(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5085/api/consultant/dashboard?_=${Date.now()}', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load data');

        const data = await res.json();
        console.log('API data:', data);


        setConsultant({
          name: data.fullName,
          avatar: data.profileImageUrl,
          earnings: data.earnings,
        });

        setNextConsultation(data.nextConsultation ?? null);
        setUpcomingConsultations(data.upcomingConsultations ?? []);
        setConsultationRequests(data.consultationRequests ?? []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleAccept = (id: string) => {
    console.log("Accepted request:", id);
    // TODO: Add API call to accept request
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    console.log("Rejected request:", id, "Reason:", rejectReason);
    // TODO: Add API call to reject request with reason
    setRejectingId(null);
    setRejectReason('');
  };

  if (!consultant) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <img src={consultant.avatar} alt={consultant.name} className="w-12 h-12 rounded-full mr-4" />
          <span className="text-xl font-semibold">{consultant.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-8 h-8 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Next Consultation</h2>
          </div>
          <p className="text-2xl font-bold">{nextConsultation?.date || 'N/A'}</p>
          <p className="text-xl">{nextConsultation?.time || ''}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <ListIcon className="w-8 h-8 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Requests</h2>
          </div>
          <p className="text-4xl font-bold">{consultationRequests.length}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSignIcon className="w-8 h-8 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Earnings</h2>
          </div>
          <p className="text-4xl font-bold">${consultant.earnings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Consultations</h2>
          <div className="space-y-4">
            {upcomingConsultations.length === 0 ? (
              <div className="text-gray-500">No upcoming consultations</div>
            ) : (
              upcomingConsultations.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-lg font-semibold">{item.clientName}</p>
                  <p className="text-sm text-gray-600">{item.date} at {item.time}</p>
                  <p className="text-sm text-gray-500 italic mt-1">{item.topic}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Consultation Requests</h2>
          <div className="space-y-4">
            {consultationRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{request.clientName}</h3>
                  <span className="text-sm text-gray-500">{request.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{request.topic}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">View</Button>
                    <Button onClick={() => handleAccept(request.id)}>Accept</Button>
                    <Button variant="destructive" onClick={() => setRejectingId(request.id)}>Reject</Button>
                  </div>
                  {rejectingId === request.id && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Reason for rejection"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <Button className="mt-2" onClick={() => handleReject(request.id)}>
                        Submit Rejection
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;

