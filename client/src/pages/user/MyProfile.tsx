import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const [email] = useState(user?.email || '');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/user/upload-avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      alert('Failed to upload avatar');
    } else {
      const data = await res.json();
      console.log('Avatar uploaded:', data.url);
      // setAvatar(data.url); // ← если backend возвращает URL вместо base64
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          location,
          about,
          profileImageUrl: avatar,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="flex items-center mb-8 gap-6">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 border border-gray-300">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6" />
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
        <div>
          <p className="text-sm text-gray-600">Click to upload avatar</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
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

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York"
            />
          </div>

          <div>
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell something about yourself..."
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
