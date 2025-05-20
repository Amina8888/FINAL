import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import SlotBookingModal from '@/components/SlotBookingModal';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

const ConsultantSearch: React.FC = () => {
  const { token } = useAuth();
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const specializations = [
    'Technology', 'Law', 'Health', 'Finance', 'Marketing',
    'Human Resources', 'Strategy', 'Education', 'Media', 'Sales',
    'Customer Service', 'Design', 'Product Management', 'Project Management',
    'Business Development', 'Operations Management'
  ];

  const fetchConsultants = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        specialization: selectedSpecialization !== 'All' ? selectedSpecialization : '',
        keyword,
        minPrice: String(priceRange[0]),
        maxPrice: String(priceRange[1]),
        page: String(page),
        limit: '10',
      });

      const res = await fetch(`http://localhost:5000/api/specialist/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setConsultants(prev => [...prev, ...data]);
      if (data.length < 10) setHasMore(false);
    } catch (err) {
      console.error('Failed to fetch consultants:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSpecialization, keyword, priceRange, page, token, hasMore]);

  useEffect(() => {
    setConsultants([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm, selectedSpecialization, keyword, priceRange]);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const debounce = (fn: any, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearchChange = debounce((value: string) => setSearchTerm(value), 500);

  const openBookingModal = async (consultant: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/specialist/${consultant.id}/available`);
      const slots = await res.json();
      setAvailableSlots(slots);
      setSelectedConsultant(consultant);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to fetch slots');
    }
  };

  const bookSlot = async (slotId: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/consultation/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          calendarSlotId: slotId,
          specialistId: selectedConsultant.id,
          pricePaid: selectedConsultant.price,
        }),
      });

      if (res.ok) {
        alert('Consultation booked!');
        setModalOpen(false);
      } else {
        alert('Booking failed.');
      }
    } catch {
      alert('Booking error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Consultants ({consultants.length})</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 sticky top-24 h-fit">
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <Input placeholder="Search" onChange={(e) => handleSearchChange(e.target.value)} />
            <h2 className="text-lg font-semibold mt-4">Specialization</h2>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <h2 className="text-xl font-semibold mb-4">Price Range ($)</h2>
            <Slider
              min={0}
              max={200}
              step={5}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          {consultants.length === 0 && !loading && <p>No consultants found.</p>}
          <div className="grid md:grid-cols-2 gap-6">
            {consultants.map((consultant) => (
              <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                <div className="flex items-center mb-4">
                  <img src={consultant.image} className="w-16 h-16 rounded-full mr-4" alt={consultant.name} />
                  <div>
                    <Link to={`/user/consultant/${consultant.id}`} className="font-semibold text-lg hover:text-blue-600">{consultant.name}</Link>
                    <p className="text-sm text-gray-600">{consultant.specialization}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-5 w-5 ${i < consultant.rating ? '' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-2 text-sm">{consultant.description}</p>
                <p className="font-semibold text-blue-700 mb-2">${consultant.price}</p>
                <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={() => openBookingModal(consultant)}>Book Consultation</Button>
              </div>
            ))}
          </div>
          {loading && <p className="text-center mt-4">Loading more consultants...</p>}
        </div>
      </div>
      <SlotBookingModal open={modalOpen} slots={availableSlots} onClose={() => setModalOpen(false)} onBook={bookSlot} />
    </div>
  );
};

export default ConsultantSearch;


