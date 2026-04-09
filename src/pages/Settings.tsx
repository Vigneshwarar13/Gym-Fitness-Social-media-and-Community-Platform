import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, CreditCard, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
            <User className="mr-3 h-5 w-5" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
            <Bell className="mr-3 h-5 w-5" />
            Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
            <Shield className="mr-3 h-5 w-5" />
            Privacy
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
            <CreditCard className="mr-3 h-5 w-5" />
            Subscription
          </Button>
          <div className="pt-4 border-t border-gray-800">
             <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={logout}>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
             </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-bold border-b border-gray-800 pb-4">Edit Profile</h2>
            
            <div className="flex items-center space-x-4">
               <img 
                  src={user?.avatar || user?.profilePic || "https://github.com/shadcn.png"} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
               />
               <Button variant="outline" size="sm">Change Avatar</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <Input defaultValue={user?.name} />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Username</label>
                  <Input defaultValue={user?.name?.toLowerCase().replace(' ', '')} />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <Input defaultValue={user?.email} disabled className="opacity-50" />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Bio</label>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your fitness journey..."
                  />
               </div>
            </div>
            
            <div className="flex justify-end pt-4">
               <Button>Save Changes</Button>
            </div>
          </Card>

          <Card className="p-6">
             <h2 className="text-xl font-bold border-b border-gray-800 pb-4 mb-4">Subscription</h2>
             <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div>
                   <p className="font-bold text-primary">Free Plan</p>
                   <p className="text-sm text-gray-400">Upgrade to unlock premium features</p>
                </div>
                <Button size="sm">Upgrade</Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
