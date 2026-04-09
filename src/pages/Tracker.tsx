import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  _id: string;
  userId: string;
  date: string;
  exercises: Exercise[];
  caloriesBurned: number;
  notes: string;
  createdAt: string;
}

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout;
  onSave: (updatedWorkout: Workout) => void;
}

const EditWorkoutModal = ({ isOpen, onClose, workout, onSave }: EditWorkoutModalProps) => {
  const [formData, setFormData] = useState<Workout>(workout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(workout);
  }, [workout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExerciseChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedExercises = formData.exercises.map((exercise, i) =>
      i === index ? { ...exercise, [e.target.name]: e.target.value } : exercise
    );
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const addExerciseField = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 0, reps: 0, weight: 0 }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.put(`/workouts/${formData._id}`, formData);
      onSave(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update workout');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg p-6 space-y-4 bg-dark-800 border-dark-700">
        <h2 className="text-2xl font-bold text-white">Edit Workout</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <Input type="date" name="date" value={formData.date.split('T')[0]} onChange={handleChange} required />
          </div>
          {formData.exercises.map((exercise, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input type="text" name="name" placeholder="Exercise Name" value={exercise.name} onChange={(e) => handleExerciseChange(index, e)} required />
              <Input type="number" name="sets" placeholder="Sets" value={exercise.sets} onChange={(e) => handleExerciseChange(index, e)} required />
              <Input type="number" name="reps" placeholder="Reps" value={exercise.reps} onChange={(e) => handleExerciseChange(index, e)} required />
              <Input type="number" name="weight" placeholder="Weight (kg)" value={exercise.weight} onChange={(e) => handleExerciseChange(index, e)} required />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addExerciseField}>Add Another Exercise</Button>
          <div>
            <label className="block text-sm font-medium text-gray-300">Calories Burned</label>
            <Input type="number" name="caloriesBurned" value={formData.caloriesBurned} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 rounded-md bg-dark-700 border border-dark-600 text-white focus:ring-primary focus:border-primary" rows={3}></textarea>
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
};

const calorieData = [
  { name: 'Carbs', value: 45, color: '#10B981' },
  { name: 'Protein', value: 30, color: '#3B82F6' },
  { name: 'Fat', value: 25, color: '#F59E0B' },
];

const weeklyProgress = [
  { day: 'M', weight: 75.5 },
  { day: 'T', weight: 75.4 },
  { day: 'W', weight: 75.2 },
  { day: 'T', weight: 75.1 },
  { day: 'F', weight: 75.0 },
  { day: 'S', weight: 74.8 },
  { day: 'S', weight: 74.8 },
];

export default function Tracker() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    exercises: [{ name: '', sets: 0, reps: 0, weight: 0 }],
    caloriesBurned: 0,
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user, currentDate]);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError('');
    try {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const res = await API.get(`/workouts/${user?._id}?date=${formattedDate}`);
      setWorkouts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch workouts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleNewExerciseChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedExercises = newWorkout.exercises.map((exercise, i) =>
      i === index ? { ...exercise, [e.target.name]: e.target.value } : exercise
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const addNewExerciseField = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: '', sets: 0, reps: 0, weight: 0 }],
    });
  };

  const handleAddWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/workouts', newWorkout);
      setShowAddWorkout(false);
      setNewWorkout({
        date: new Date().toISOString().split('T')[0],
        exercises: [{ name: '', sets: 0, reps: 0, weight: 0 }],
        caloriesBurned: 0,
        notes: '',
      });
      fetchWorkouts(); // Refresh workouts
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add workout');
      console.error(err);
    }
  };

  const handleEditWorkout = (workoutToEdit: Workout) => {
    setEditingWorkout(workoutToEdit);
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map((w) => (w._id === updatedWorkout._id ? updatedWorkout : w)));
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await API.delete(`/workouts/${workoutId}`);
        setWorkouts(workouts.filter((w) => w._id !== workoutId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete workout');
        console.error(err);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calories Tracker */}
        <div className="w-full md:w-1/3 space-y-6">
           <Card className="p-6">
             <h3 className="font-bold text-lg mb-4">Daily Nutrition</h3>
             <div className="h-48 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={calorieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {calorieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">1,800</span>
                  <span className="text-xs text-gray-400">kcal consumed</span>
               </div>
             </div>
             
             <div className="flex justify-center gap-4 mt-4 text-sm">
                {calorieData.map((item) => (
                   <div key={item.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                   </div>
                ))}
             </div>
           </Card>

           <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Weight Progress</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress}>
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                    <RechartsTooltip 
                       contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                       itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* Diet & Workout Schedule */}
        <div className="w-full md:w-2/3 space-y-6">
           {/* Header */}
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{formatDate(currentDate)}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setCurrentDate(newDate);
                }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setCurrentDate(newDate);
                }}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => setShowAddWorkout(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Workout
                </Button>
              </div>
           </div>

           {error && <p className="text-red-500 text-center">{error}</p>}
           {loading ? (
             <div className="text-white text-center">Loading workouts...</div>
           ) : workouts.length === 0 ? (
             <div className="text-gray-400 text-center">No workouts logged for this date.</div>
           ) : (
             workouts.map((workout) => (
               <Card key={workout._id} className="p-4">
                 <h3 className="font-bold text-lg mb-2">Workout on {new Date(workout.date).toLocaleDateString()}</h3>
                 {workout.exercises.map((exercise, index) => (
                   <div key={index} className="flex justify-between items-center text-gray-300 text-sm mb-1">
                     <span>{exercise.name}</span>
                     <span>{exercise.sets} sets x {exercise.reps} reps @ {exercise.weight}kg</span>
                   </div>
                 ))}
                 {workout.notes && <p className="text-gray-400 text-sm mt-2">Notes: {workout.notes}</p>}
                 <div className="flex justify-end gap-2 mt-4">
                   <Button variant="outline" size="sm" onClick={() => handleEditWorkout(workout)}>Edit</Button>
                   <Button variant="destructive" size="sm" onClick={() => handleDeleteWorkout(workout._id)}>Delete</Button>
                 </div>
               </Card>
             ))
           )}

           {showAddWorkout && (
             <Card className="p-6 mt-6">
               <h3 className="font-bold text-lg mb-4">Add New Workout</h3>
               <form onSubmit={handleAddWorkoutSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-300">Date</label>
                   <Input type="date" name="date" value={newWorkout.date} onChange={handleAddWorkoutChange} required />
                 </div>
                 {newWorkout.exercises.map((exercise, index) => (
                   <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                     <Input type="text" name="name" placeholder="Exercise Name" value={exercise.name} onChange={(e) => handleNewExerciseChange(index, e)} required />
                     <Input type="number" name="sets" placeholder="Sets" value={exercise.sets} onChange={(e) => handleNewExerciseChange(index, e)} required />
                     <Input type="number" name="reps" placeholder="Reps" value={exercise.reps} onChange={(e) => handleNewExerciseChange(index, e)} required />
                     <Input type="number" name="weight" placeholder="Weight (kg)" value={exercise.weight} onChange={(e) => handleNewExerciseChange(index, e)} required />
                   </div>
                 ))}
                 <Button type="button" variant="outline" onClick={addNewExerciseField}>Add Another Exercise</Button>
                 <div>
                   <label className="block text-sm font-medium text-gray-300">Calories Burned</label>
                   <Input type="number" name="caloriesBurned" value={newWorkout.caloriesBurned} onChange={handleAddWorkoutChange} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300">Notes</label>
                   <textarea name="notes" value={newWorkout.notes} onChange={handleAddWorkoutChange} className="w-full p-2 rounded-md bg-dark-700 border border-dark-600 text-white focus:ring-primary focus:border-primary" rows={3}></textarea>
                 </div>
                 <div className="flex justify-end gap-2">
                   <Button type="button" variant="outline" onClick={() => setShowAddWorkout(false)}>Cancel</Button>
                   <Button type="submit">Save Workout</Button>
                 </div>
               </form>
             </Card>
           )}
        </div>
      </div>

      {editingWorkout && (
        <EditWorkoutModal
          isOpen={!!editingWorkout}
          onClose={() => setEditingWorkout(null)}
          workout={editingWorkout}
          onSave={handleUpdateWorkout}
        />
      )}
    </div>
  );
}
