import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '@/components/ui/slider';

// Mock data for consultants
const mockConsultants = [
  { id: 1, name: "Amaia Coathe", specialization: "Legal", rating: 5, description: "Rico,prot-tendanced lawi firmalk professional experoe.", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, name: "John Smith", specialization: "Legal", rating: 5, description: "Expert so-cancuprofessor lesg a carrdiclate.", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 3, name: "Annie Peterson", specialization: "Human", rating: 5, description: "Long-siliaend ererluiting in a fast paced legally.", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 4, name: "Affillay Ouver", specialization: "Sncitane", rating: 5, description: "A cerrf-modern upg professore, expert.", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 5, name: "Marina Footh", specialization: "Legal", rating: 5, description: "Experienced legal consultant with expertise in corporate law.", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 6, name: "Dayng Clark", specialization: "Finance", rating: 5, description: "Financial advisor specializing in investment strategies.", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];

const ConsultantSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState([100, 0]);
  const [keyword, setKeyword] = useState('');

  const specializations = ['All', 'Legal', 'Human', 'Sncitane', 'Finance'];

  const filteredConsultants = mockConsultants.filter(consultant => {
    return (
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSpecialization === '' || selectedSpecialization === 'All' || consultant.specialization === selectedSpecialization) &&
      (keyword === '' || consultant.description.toLowerCase().includes(keyword.toLowerCase()))
    );
  });

  return (
    <div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Candultinas</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar for filters */}
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
                    <SelectItem key={specialization} value={specialization}>{specialization}</SelectItem>
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
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <h2 className="text-xl font-semibold mb-4 mt-6">Rating</h2>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-6 w-6 text-yellow-400" />
                ))}
              </div>
              <h2 className="text-xl font-semibold mb-4 mt-6">Keyword</h2>
              <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Right side consultant grid */}
          <div className="w-full md:w-3/4">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredConsultants.map((consultant) => (
                <div key={consultant.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <img src={consultant.image} alt={consultant.name} className="w-16 h-16 rounded-full mr-4" />
                    <div>
                      <Link to={`/user/consultant/${consultant.id}`} className="text-xl font-semibold hover:text-blue-600">
                        {consultant.name}
                      </Link>
                      <p className="text-gray-600">{consultant.specialization}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{consultant.description}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Request Consultation
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantSearch;
