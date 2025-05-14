import React from 'react';
import { CalendarIcon, ListIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';

const ConsultantDashboard: React.FC = () => {
  const consultant = {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    nextConsultation: {
      date: "April 25, 2024",
      time: "10:00 AM"
    },
    requests: 3,
    earnings: 1250
  };

  const upcomingConsultation = {
    date: "April 25, 2024",
    clientName: "Jane Smith"
  };

  const consultationRequests = [
    { id: 1, clientName: "Alice Johnson", date: "April 22, 2024", request: "Need advice on marketing strategy" },
    { id: 2, clientName: "Michael Brown", date: "April 21, 2024", request: "Assistance with project management" },
    { id: 3, clientName: "Emily Wilson", date: "April 20, 2024", request: "Looking for career counseling" },
  ];

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
          <p className="text-2xl font-bold">{consultant.nextConsultation.date}</p>
          <p className="text-xl">{consultant.nextConsultation.time}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <ListIcon className="w-8 h-8 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Requests</h2>
          </div>
          <p className="text-4xl font-bold">{consultant.requests}</p>
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
          <h2 className="text-2xl font-bold mb-4">Upcoming Consultation</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-xl font-semibold">{upcomingConsultation.date}</p>
            <p className="text-lg">{upcomingConsultation.clientName}</p>
            <Button className="mt-4">Join</Button>
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
                <p className="text-gray-700 mb-4">{request.request}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">View</Button>
                  <Button>Accept</Button>
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
