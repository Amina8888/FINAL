import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { PlusCircle, X } from 'lucide-react';

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

const MyProfile: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [description, setDescription] = useState('Experienced consultant specializing in business strategy and operations.');
  const [price, setPrice] = useState(100);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    { id: 1, company: 'ABC Corp', position: 'Senior Consultant', startDate: '2018-01', endDate: '2023-04' }
  ]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<string[]>([]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newCertificates = Array.from(files).map(file => URL.createObjectURL(file));
      setCertificates([...certificates, ...newCertificates]);
    }
  };

  const addWorkExperience = () => {
    const newId = workExperiences.length > 0 ? Math.max(...workExperiences.map(we => we.id)) + 1 : 1;
    setWorkExperiences([...workExperiences, { id: newId, company: '', position: '', startDate: '', endDate: '' }]);
  };

  const updateWorkExperience = (id: number, field: keyof WorkExperience, value: string) => {
    setWorkExperiences(workExperiences.map(we => 
      we.id === id ? { ...we, [field]: value } : we
    ));
  };

  const removeWorkExperience = (id: number) => {
    setWorkExperiences(workExperiences.filter(we => we.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="flex items-center mb-4">
          {photo ? (
            <img src={photo} alt="Profile" className="w-32 h-32 rounded-full object-cover mr-4" />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}
          <Button onClick={() => photoInputRef.current?.click()}>
            {photo ? 'Change Photo' : 'Upload Photo'}
          </Button>
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="mb-4"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your expertise and experience"
          className="mb-4"
        />
        <div className="flex items-center">
          <span className="mr-2">$</span>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Your hourly rate"
            className="w-32"
          />
          <span className="ml-2">per hour</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
        {workExperiences.map((we) => (
          <div key={we.id} className="mb-4 p-4 border rounded">
            <Input
              value={we.company}
              onChange={(e) => updateWorkExperience(we.id, 'company', e.target.value)}
              placeholder="Company"
              className="mb-2"
            />
            <Input
              value={we.position}
              onChange={(e) => updateWorkExperience(we.id, 'position', e.target.value)}
              placeholder="Position"
              className="mb-2"
            />
            <div className="flex mb-2">
              <Input
                type="month"
                value={we.startDate}
                onChange={(e) => updateWorkExperience(we.id, 'startDate', e.target.value)}
                className="mr-2"
              />
              <Input
                type="month"
                value={we.endDate}
                onChange={(e) => updateWorkExperience(we.id, 'endDate', e.target.value)}
              />
            </div>
            <Button variant="destructive" onClick={() => removeWorkExperience(we.id)}>Remove</Button>
          </div>
        ))}
        <Button onClick={addWorkExperience} className="flex items-center">
          <PlusCircle className="mr-2" /> Add Work Experience
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Certificates and Licenses</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {certificates.map((cert, index) => (
            <div key={index} className="relative">
              <img src={cert} alt={`Certificate ${index + 1}`} className="w-full h-40 object-cover rounded" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setCertificates(certificates.filter((_, i) => i !== index))}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={() => certificateInputRef.current?.click()}>
          Upload Certificate/License
        </Button>
        <input
          type="file"
          ref={certificateInputRef}
          onChange={handleCertificateUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      <Button className="w-full">Save Profile</Button>
    </div>
  );
};

export default MyProfile;
