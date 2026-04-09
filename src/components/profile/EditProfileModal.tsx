import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import API from '../../services/api';

interface ProfileData {
  _id: string;
  name: string;
  bio: string;
  fitnessGoals: string;
  profilePic: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (updatedData: ProfileData) => void;
}

export default function EditProfileModal({ isOpen, onClose, profileData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    fitnessGoals: '',
    profilePic: '',
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        bio: profileData.bio || '',
        fitnessGoals: profileData.fitnessGoals || '',
        profilePic: profileData.profilePic || '',
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let updatedProfilePic = formData.profilePic;

    try {
      if (profilePicFile) {
        const data = new FormData();
        data.append('image', profilePicFile);
        const uploadRes = await API.post('/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedProfilePic = uploadRes.data.url;
      }

      const updatedData = { ...formData, profilePic: updatedProfilePic };
      const res = await API.put(`/users/${profileData._id}`, updatedData);
      onSave(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg p-6 space-y-4 bg-dark-800 border-dark-700">
        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="w-full p-2 rounded-md bg-dark-700 border border-dark-600 text-white focus:ring-primary focus:border-primary"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Fitness Goals</label>
            <Input type="text" name="fitnessGoals" value={formData.fitnessGoals} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-dark-900 hover:file:bg-primary/80" />
            {formData.profilePic && !profilePicFile && (
              <img src={formData.profilePic} alt="Current Profile" className="mt-2 w-20 h-20 rounded-full object-cover" />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
