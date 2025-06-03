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
  
      const res = await fetch(`/api/consultant/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error('Failed to fetch consultants');

      const json = await res.json();
      console.log(json);
      const items = json.items || [];
      const totalCount = json.totalCount || 0;
      console.log(items);
  
      setConsultants(prev => {
        const unique = Array.from(new Map([...prev, ...items].map(c => [c.id, c])).values());
        return unique;
      });
  
      if (items.length < 10 || consultants.length + items.length >= totalCount) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to fetch consultants:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSpecialization, keyword, priceRange, page, token, hasMore, consultants.length]);
  

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
      const res = await fetch(`/api/calendar/specialist/${consultant.id}/available`);
      const slots = await res.json();
      setAvailableSlots(slots);
      setSelectedConsultant(consultant);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to fetch slots');
    }
  };

  const bookSlot = async (datetime: Date, topic: string) => {
    console.log('Datettime:', datetime);
    console.log('ISO Datetime:', datetime.toISOString());
    try {
      const res = await fetch('/api/consultation/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          specialistId: selectedConsultant.id,
          scheduledAt: datetime.toISOString(),
          topic: topic || "General",
        }),
      });
  
      if (res.ok) {
        alert('Consultation request sent!');
        setModalOpen(false);
      } else {
        const msg = await res.text();
        alert(`Booking failed: ${msg}`);
      }
    } catch (err) {
      alert('Error while booking consultation');
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
    <div className="flex items-center justify-between mb-4">
      {/* Левый блок с фото и текстом */}
      <div className="flex items-center gap-4">
        <img
          src={consultant.profileImageUrl}
          alt={consultant.fullName}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <Link
            to={`/user/consultant/${consultant.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {consultant.fullName || 'Unnamed'}
          </Link>
          <p className="text-sm text-gray-600">
            {consultant.category || 'No category'}
            {consultant.subcategory && ` • ${consultant.subcategory}`}
          </p>
        </div>
      </div>

      {/* Правый блок с ценой и рейтингом */}
      <div className="text-right">
        <p className="text-blue-700 font-semibold text-lg mb-1">${consultant.pricePerConsultation}</p>
        <div className="flex justify-end text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < Math.round(consultant.rating || 0) ? '' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Описание */}
    {consultant.description && (
      <p className="text-gray-700 text-sm mb-4">{consultant.description}</p>
    )}

    <Button
      className="w-full bg-green-600 text-white hover:bg-green-700"
      onClick={() => openBookingModal(consultant)}
    >
      Book Consultation
    </Button>
      </div>
      ))}

          </div>
          {loading && <p className="text-center mt-4">Loading more consultants...</p>}
        </div>
      </div>
      <SlotBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onBook={bookSlot}
      />
    </div>
  );
};

export default ConsultantSearch;


