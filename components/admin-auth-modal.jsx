'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export default function AdminAuthModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Hardcoded credentials - in a real app, you would use a proper authentication system
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'password123';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onClose();
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Administrator Login</DialogTitle>
          <DialogDescription className="text-gray-300">
            Please enter your admin credentials to access the admin panel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-2 rounded text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter admin username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
