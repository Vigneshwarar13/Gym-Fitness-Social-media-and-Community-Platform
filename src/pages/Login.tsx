import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Dumbbell } from 'lucide-react';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-dark-800 border-dark-700">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to GymSocial</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <Input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
