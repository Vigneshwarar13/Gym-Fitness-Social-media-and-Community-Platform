import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { Settings, User as UserIcon } from 'lucide-react';
import API from '../services/api';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/auth/me`);
        setProfileData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdate = (updatedUser: any) => {
    setProfileData(updatedUser);
  };

  if (loading) {
    return <div className="text-white text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!profileData) {
    return <div className="text-gray-400 text-center py-8">No profile data available. Please log in.</div>;
  }
  
  // Mock data - in real app fetch based on ID
  const isTrainer = false; // Assuming no role differentiation for now
  
  const stats = [
    { label: 'Followers', value: profileData.followers?.length || 0 },
    { label: 'Following', value: profileData.following?.length || 0 },
    { label: 'Workouts', value: 'N/A' }, // Will be fetched from workout API
  ];

  if (isTrainer) {
    stats.push({ label: 'Clients', value: 'N/A' });
  }

  const galleryImages = [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574680096141-1cddd32e24f7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <img 
              src={profileData.profilePic || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop"} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-dark-900"
            />
            <div className="absolute -bottom-2 -right-2 bg-dark-900 p-1.5 rounded-full">
               <div className="bg-primary text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                 {profileData.role || 'User'}
               </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-gray-400">@{profileData.name?.toLowerCase().replace(' ', '')}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                <Button variant="ghost" size="sm"><Settings className="h-5 w-5" /></Button>
                <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
              </div>
            </div>

            <p className="text-gray-200 max-w-2xl">
              {profileData.bio || 'No bio available.'}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {profileData.fitnessGoals && (
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  {profileData.fitnessGoals}
                </div>
              )}
              {/* <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                New York, USA
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="text-primary hover:underline">gymsocial.com/johndoe</a>
              </div> */}
            </div>

            <div className="flex gap-6 pt-2">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-bold text-lg">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Trainer Dashboard Stats (Only visible if trainer) */}
      {isTrainer && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-dark-800/50 border-primary/20">
             <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
             <div className="text-2xl font-bold text-primary">$2,450</div>
          </Card>
          <Card className="p-4 bg-dark-800/50 border-primary/20">
             <div className="text-sm text-gray-400 mb-1">Active Plans</div>
             <div className="text-2xl font-bold text-white">12</div>
          </Card>
           <Card className="p-4 bg-dark-800/50 border-primary/20">
             <div className="text-sm text-gray-400 mb-1">Pending Requests</div>
             <div className="text-2xl font-bold text-white">5</div>
          </Card>
          <Card className="p-4 bg-dark-800/50 border-primary/20">
             <div className="text-sm text-gray-400 mb-1">Completed Sessions</div>
             <div className="text-2xl font-bold text-white">88</div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((src, index) => (
            <img key={index} src={src} alt={`Gallery image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
          ))}
        </div>
      </Card>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}
