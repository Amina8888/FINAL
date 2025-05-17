import React, { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [nextConsultation, setNextConsultation] = useState<any>(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [previousConsultations, setPreviousConsultations] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5085/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load data');

        const data = await res.json();
        setUser({
          name: data.name,
          avatar: data.avatarUrl,
          totalSpent: data.totalSpent,
          totalConsultations: data.totalConsultations,
        });
        setNextConsultation(data.nextConsultation);
        setUpcomingConsultations(data.upcomingConsultations);
        setPreviousConsultations(data.previousConsultations);
        setPendingRequests(data.pendingRequests);
      } catch (err) {
        console.error('Dashboard error', err);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Dashboard</h1>
        <div className="flex items-center">
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
          <span className="text-xl font-semibold">{user.name}</span>
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
            <h2 className="text-xl font-semibold">Total Consultations</h2>
          </div>
          <p className="text-4xl font-bold">{user.totalConsultations}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSignIcon className="w-8 h-8 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Total Spent</h2>
          </div>
          <p className="text-4xl font-bold">${user.totalSpent}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Consultations</h2>
        {upcomingConsultations.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="text-lg font-semibold">{item.consultantName}</p>
            <p className="text-sm text-gray-600">{item.date} at {item.time}</p>
            <p className="text-sm text-gray-500 italic">{item.topic}</p>
            <div className="flex gap-2 mt-2">
              {item.canReschedule && <Button variant="outline">Reschedule</Button>}
              {item.canCancel && <Button variant="destructive">Cancel</Button>}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Previous Consultations</h2>
        {previousConsultations.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="font-semibold">{item.consultantName}</p>
            <p className="text-sm text-gray-600">{item.date}</p>
            <p className="text-sm italic">{item.topic}</p>
            <p className="text-sm">Price: ${item.price}</p>
            <Button className="mt-2">Leave a Review</Button>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
        {pendingRequests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="font-semibold">{req.topic}</p>
            <p className="text-sm text-gray-600">Requested on: {req.date}</p>
            <p className={`text-sm ${req.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>Status: {req.status}</p>
            {req.status === 'Rejected' && (
              <p className="text-sm italic text-gray-400">Reason: {req.reason}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default UserDashboard;

