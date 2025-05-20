import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Upload, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

const MyProfile: React.FC = () => {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const email = user?.email ?? '';
  const [about, setAbout] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('USA');
  const [city, setCity] = useState('New York');
  const [certificateUrls, setCertificateUrls] = useState<string[]>([]);

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([{
    id: 1,
    company: '',
    position: '',
    startDate: '',
    endDate: ''
  }]);

  const consultancyAreas = [
    "Technology",
    "Finance",
    "Marketing",
    "Human Resources",
    "Operations",
    "Strategy",
  ];

  console.log("user from useAuth:", user);
  console.log("token from useAuth:", token);
  useEffect(() => {
  
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5085/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCertificateUrls(data.certificateUrls || []);
        setAvatar(data.profileImageUrl || null);
        setName(data.fullName || '');
        setAbout(data.about || '');
        setCategory(data.category || '');
        setTags(data.subcategory || '');
        setCountry(data.country || '');
        setCity(data.city || '');
        setPrice(data.pricePerConsultation?.toString() || '');
        const parsedExperiences = (data.workExperiences || []).map((we: any, index: number) => ({
          id: we.id || index + 1,
          company: we.company || '',
          position: we.position || '',
          startDate: we.description?.split(' - ')[0] || '',
          endDate: we.description?.split(' - ')[1] || '',
        }));
      
        setWorkExperiences(parsedExperiences);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

    if (token) fetchProfile();
  }, [token]);

  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // 1. Превью на клиенте
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string); // для показа фото
    };
    reader.readAsDataURL(file);
  
    // 2. Отправка на сервер
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("http://localhost:5085/api/profile/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // если требуется авторизация
      },
      body: formData,
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log("Avatar uploaded", data.url);
      // setAvatar(data.url); // если backend возвращает URL
    } else {
      console.error("Failed to upload avatar");
    }
  };

  const handleSave = async () => {
    try {
      const profileRes = await fetch('http://localhost:5085/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          about,
          category,
          subcategory: tags,
          profileImageUrl: avatar,
          pricePerConsultation: parseFloat(price) || 0,
          country,
          city,
        }),
      });
  
      if (!profileRes.ok) {
        throw new Error('Failed to save profile');
      }
  
      // Сохраняем work experience (по одному или массивом)
      for (const we of workExperiences) {
        await fetch('http://localhost:5085/api/profile/work-experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company: we.company,
            position: we.position,
            description: `${we.startDate} - ${we.endDate}`,
            duration: `${we.startDate} - ${we.endDate}`,
          }),
        });
      }
  
      alert('Profile saved!');
    } catch (error) {
      console.error('Save failed', error);
      alert('Error saving profile');
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

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("File", files[i]);
  
      const res = await fetch("http://localhost:5085/api/license/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        setCertificateUrls((prev) => [...prev, data.url]);
      } else {
        console.error("Failed to upload license");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <div className="flex items-center">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center text-gray-500">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                "No Photo"
              )}
            </div>
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        <span className="text-xl font-semibold">{name}</span>
      </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. USA"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York"
            />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your area of consultancy" />
            </SelectTrigger>
            <SelectContent>
              {consultancyAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write a brief description about yourself..."
            className="mb-6"
          />

          <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
          <div className="space-y-4 mb-6">
            {workExperiences.map((we) => (
              <div key={we.id} className="p-4 border rounded">
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
                <div className="flex gap-2">
                  <Input
                    type="month"
                    value={we.startDate}
                    onChange={(e) => updateWorkExperience(we.id, 'startDate', e.target.value)}
                  />
                  <Input
                    type="month"
                    value={we.endDate}
                    onChange={(e) => updateWorkExperience(we.id, 'endDate', e.target.value)}
                  />
                </div>
                <Button variant="destructive" onClick={() => removeWorkExperience(we.id)} className="mt-2">Remove</Button>
              </div>
            ))}
            <Button onClick={addWorkExperience} className="flex items-center">
              <PlusCircle className="mr-2" /> Add Work Experience
            </Button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Price for Consultation</h2>
          <div className="mb-6">
            <Label htmlFor="price">Hourly Rate ($)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter your hourly rate"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4">Tags/Keywords</h2>
          <div className="mb-6">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Uploaded Certificates</h2>
          <ul className="mb-6 space-y-2">
            {certificateUrls.length > 0 ? (
              certificateUrls.map((url, index) => (
                <li key={index}>
                  <a href={`http://localhost:5085${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {typeof url === 'string' ? url.split('/').pop() : 'Unnamed file'}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No certificates uploaded yet.</li>
            )}
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Certificates and Licenses</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
            <input
              type="file"
              id="license-upload"
              className="hidden"
              onChange={handleLicenseUpload}
              multiple
            />
            <label htmlFor="license-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Drag & drop files here, or</p>
              <p className="mt-1 text-sm text-blue-500">Browse</p>
            </label>
          </div>

          <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
