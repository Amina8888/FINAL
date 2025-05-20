import React, { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon, DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const UserDashboard: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [nextConsultation, setNextConsultation] = useState<any>(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [previousConsultations, setPreviousConsultations] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const now = new Date();

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5085/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();
      console.log(data);
      setUser({
        name: data.fullName,
        avatar: data.profileImageUrl,
        totalSpent: data.totalSpent,
        totalConsultations: data.totalConsultations,
      });
      setNextConsultation(data.nextConsultation);
      setUpcomingConsultations(data.upcomingConsultations || []);
      setPreviousConsultations(data.pastConsultations || []);
      setPendingRequests(data.myRequests || []);
    } catch (err) {
      console.error('Dashboard error', err);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [token]);
  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  const handleCancel = async () => {
    if (!cancelingId || !cancelReason.trim()) return;
    try {
      const res = await fetch(`http://localhost:5085/api/consultation/cancel/${cancelingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (res.ok) {
        setToastMessage('Consultation canceled');
        setShowToast(true);
        await fetchDashboardData();
        setCancelingId(null);
        setCancelReason('');
      }
    } catch (err) {
      console.error('Cancel error', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewingId || !reviewText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5085/api/consultation/review/${reviewingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, text: reviewText }),
      });
      if (res.ok) {
        setToastMessage('Review submitted');
        setShowToast(true);
        await fetchDashboardData();
        setReviewingId(null);
        setReviewText('');
      }
    } catch (err) {
      console.error('Review error', err);
    }
  };

  const handleJoin = (consultationId: string) => {
    console.log("Joining consultation:", consultationId);
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/calendar")}>
            Calendar
          </Button>
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
          <span className="text-xl font-semibold">{user.name}</span>
        </div>
      </div>

      {/* Stats */}
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
            <h2 className="text-xl font-semibold">Consultations</h2>
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

      {/* Upcoming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Consultations</h2>
          <div className="space-y-4">
            {upcomingConsultations.length === 0 ? (
              <div className="text-gray-500">No upcoming consultations</div>
            ) : (
              upcomingConsultations.map((item) => {
                const minutesDiff = (new Date(`${item.date} ${item.time}`).getTime() - now.getTime()) / 60000;
                return (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <p className="text-lg font-semibold">{item.specialistName}</p>
                    <p className="text-sm text-gray-600">{item.date} at {item.time}</p>
                    <p className="text-sm text-gray-500 italic mt-1">{item.topic}</p>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button variant="destructive" onClick={() => setCancelingId(item.id)}>Cancel</Button>
                      {minutesDiff <= 5 && minutesDiff >= -60 && (
                        <Button onClick={() => handleJoin(item.id)}>Join</Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="text-gray-500">No pending requests</div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold">{req.topic}</p>
                  <p className="text-sm text-gray-600">{req.date}</p>
                  <p className={`text-sm ${req.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                    Status: {req.status}
                  </p>
                  {req.status === 'Rejected' && <p className="text-sm italic text-gray-400">Reason: {req.reason}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Previous */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Past Consultations</h2>
        {previousConsultations.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="font-semibold">{item.specialistName}</p>
            <p className="text-sm text-gray-600">{item.date}</p>
            <p className="text-sm italic">{item.topic}</p>
            {item.canLeaveReview && (
              <Button className="mt-2" onClick={() => setReviewingId(item.id)}>Leave Review</Button>
            )}
          </div>
        ))}
      </section>

      {/* Cancel Modal */}
      <Dialog open={!!cancelingId} onOpenChange={() => setCancelingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Consultation</DialogTitle></DialogHeader>
          <Label>Reason</Label>
          <textarea className="w-full border rounded p-2 mt-2" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelingId(null)}>Close</Button>
            <Button onClick={handleCancel}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={!!reviewingId} onOpenChange={() => setReviewingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Leave a Review</DialogTitle></DialogHeader>
          <Label>Rating (1-5)</Label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2 mb-4"
          />
          <Label>Comment</Label>
          <textarea className="w-full border rounded p-2 mt-2" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewingId(null)}>Close</Button>
            <Button onClick={handleReviewSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

