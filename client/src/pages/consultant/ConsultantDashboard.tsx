import React, { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import StartCallButton from '../../components/StartCallButton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormattedDate } from "@/hooks/useFormattedDate";


const ConsultantDashboard: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [nextConsultation, setNextConsultation] = useState<any>(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<any[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const now = new Date();
  const formatDate = useFormattedDate(); 

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/consultant/dashboard?_=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();

      setConsultant({
        name: data.fullName,
        avatar: data.profileImageUrl,
        earnings: data.earnings,
      });

      setNextConsultation(data.nextConsultation ?? null);
      setUpcomingConsultations(data.upcomingConsultations ?? []);
      setConsultationRequests(data.consultationRequests ?? []);
      console.log(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

    useEffect(() => {
      fetchDashboardData();
    }, [token]);

    useEffect(() => {
      if (showToast) {
        const timeout = setTimeout(() => setShowToast(false), 3000);
        return () => clearTimeout(timeout);
      }
    }, [showToast]);

  const handleCancel = async () => {
    if (!cancelingId || !cancelReason.trim()) return;
  
    try {
      const res = await fetch(`/api/consultation/cancel/${cancelingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason })
      });
  
      if (res.ok) {
        setToastMessage('Consultation canceled successfully');
        setShowToast(true);
        await fetchDashboardData();  // Ждём обновления
        setCancelingId(null);
        setCancelReason('');
      } else {
        const errText = await res.text(); // 👈 вместо res.json()
        console.error('Server error:', errText);
        setToastMessage(errText);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Cancel error:', error);
      setToastMessage('Unexpected error while canceling.');
      setShowToast(true);
    }
  };
  
  const handleRescheduleSave = async () => {
    if (!reschedulingId || !rescheduleDate) return;
    try {
      const res = await fetch(`/api/consultation/reschedule/${reschedulingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rescheduleDate),
      });
      if (res.ok) {
        setToastMessage('Consultation rescheduled successfully');
        setShowToast(true);
        await fetchDashboardData();  // Ждём обновления
        setIsRescheduleOpen(false);
        setReschedulingId(null);
    }
    } catch (error) {
      console.error('Reschedule error:', error);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`/api/consultation/${id}/accept`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setToastMessage('Consultation accepted successfully');
        setShowToast(true);
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    try {
      const res = await fetch(`/api/consultation/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setToastMessage('Consultation rejected successfully');
        setShowToast(true);
        await fetchDashboardData();
        setRejectingId(null);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  if (!consultant) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/calendar")}>
            Calendar
          </Button>
          <img src={consultant.avatar} alt={consultant.name} className="w-12 h-12 rounded-full" />
          <span className="text-xl font-semibold">{consultant.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <CalendarIcon className="w-8 h-8 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Next Consultation</h2>
          </div>
          {nextConsultation?.scheduledAt ? (
  <>
    <p className="text-2xl font-bold">
      {new Date(nextConsultation.scheduledAt).toLocaleDateString('en-US', {
        timeZone: 'Asia/Aqtobe',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </p>
    <p className="text-xl">
      {new Date(nextConsultation.scheduledAt).toLocaleTimeString('en-US', {
        timeZone: 'Asia/Aqtobe',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}
    </p>
  </>
) : (
  <p className="text-xl">N/A</p>
)}
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
              upcomingConsultations.map((item) => {
                const startTime = new Date(item.scheduledAt);
                const minutesDiff = (startTime.getTime() - now.getTime()) / 60000;

                return (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <p className="text-lg font-semibold">{item.clientName}</p>
                    <p className="text-sm text-gray-600">
  {new Date(item.scheduledAt).toLocaleString('en-US', {
    timeZone: 'Asia/Aqtobe',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</p>
                    <p className="text-sm text-gray-500 italic mt-1">{item.topic}</p>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button variant="outline" onClick={() => {
                        setReschedulingId(item.id);
                        setRescheduleDate(null);
                        setIsRescheduleOpen(true);
                      }}>
                        Reschedule
                      </Button>
                      <Button variant="destructive" onClick={() => setCancelingId(item.id)}>
                        Cancel
                      </Button>

                      {minutesDiff <= 5 && minutesDiff >= -60 && (
                        <>
                          {console.log("item:", item)}
                          <StartCallButton roomId={item.id} label="Join" variant="default" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })
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
                  <span className="text-sm text-gray-500">
                    {new Date(request.scheduledAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Aqtobe',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{request.topic}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-end space-x-2">
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

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Consultation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="newDate">New Date & Time</Label>
            <DatePicker
              selected={rescheduleDate}
              onChange={(date: Date | null) => setRescheduleDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleRescheduleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
<Dialog open={!!cancelingId} onOpenChange={() => setCancelingId(null)}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Cancel Consultation</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Label htmlFor="cancelReason">Reason</Label>
      <textarea
        className="w-full border rounded p-2 text-sm"
        placeholder="Reason for cancellation"
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setCancelingId(null)}>Close</Button>
      <Button onClick={handleCancel}>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Toast Message */}
{showToast && (
  <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow">
    {toastMessage}
  </div>
)}

    </div>
  );
};

export default ConsultantDashboard;
