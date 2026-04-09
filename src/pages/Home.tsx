import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Flame, Droplets, Trophy, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <Flame className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Calories Burned</p>
            <p className="text-xl font-bold">1,240 kcal</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Water Intake</p>
            <p className="text-xl font-bold">2.4 L</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-full">
            <Trophy className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Workout Streak</p>
            <p className="text-xl font-bold">5 Days</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Progress</p>
            <p className="text-xl font-bold">+2.5%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed - Removed as Community page handles posts */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Welcome to GymSocial!</h2>
          <p className="text-gray-400">Explore the community, track your workouts, and achieve your fitness goals.</p>
        </div>

        {/* Quick Actions / Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Log New Workout</Button>
              <Button variant="outline" className="w-full">Find a Trainer</Button>
              <Button variant="outline" className="w-full">Join a Challenge</Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-lg mb-4">Your Progress</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[]}> {/* No mock data */}
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
