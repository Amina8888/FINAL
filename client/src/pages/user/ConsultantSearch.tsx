import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import SlotBookingModal from "@/components/SlotBookingModal";


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
  const [priceRange, setPriceRange] = useState([100, 0]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  const specializations = ['All', 'Legal', 'Human', 'Sncitane', 'Finance'];

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: searchTerm,
          specialization: selectedSpecialization !== 'All' ? selectedSpecialization : '',
          keyword,
          minPrice: String(Math.min(priceRange[0], priceRange[1])),
          maxPrice: String(Math.max(priceRange[0], priceRange[1])),
        });

        const response = await fetch(`http://localhost:5000/api/specialists/search?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setConsultants(data);
      } catch (err) {
        console.error('Failed to fetch consultants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, [searchTerm, selectedSpecialization, keyword, priceRange, token]);

  const sortedConsultants = [...consultants].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  const openBookingModal = async (consultant: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/specialist/${consultant.id}/available`);
      const slots = await res.json();
      setAvailableSlots(slots);
      setSelectedConsultant(consultant);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to fetch available slots');
    }
  };

  const bookSlot = async (slotId: string) => {
    if (!selectedConsultant) return;
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
        const msg = await res.text();
        alert(`Booking failed: ${msg}`);
      }
    } catch (err) {
      alert('Error while booking consultation');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Consultants</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Search</h2>
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4"
            />

            <h2 className="text-xl font-semibold mb-4">Specialization</h2>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2 className="text-xl font-semibold mb-4">Price</h2>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={(value) => setPriceRange([value[1], value[0]])}
              className="mb-4"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Keyword</h2>
            <Input
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full"
            />

            <h2 className="text-xl font-semibold mb-4 mt-6">Sort By</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {sortedConsultants.map((consultant) => (
                <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={consultant.image}
                      alt={consultant.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <Link
                        to={`/user/consultant/${consultant.id}`}
                        className="text-xl font-semibold hover:text-blue-600"
                      >
                        {consultant.name}
                      </Link>
                      <p className="text-gray-600 text-sm">{consultant.specialization}</p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${star <= consultant.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{consultant.description}</p>
                  <p className="text-blue-700 font-semibold mb-2">Price: ${consultant.price}</p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => openBookingModal(consultant)}
                  >
                    Book Consultation
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SlotBookingModal
        open={modalOpen}
        slots={availableSlots}
        onClose={() => setModalOpen(false)}
        onBook={bookSlot}
      />
    </div>
  );
};

export default ConsultantSearch;

