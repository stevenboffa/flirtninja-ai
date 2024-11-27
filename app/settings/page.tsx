"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import { User, Save } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { auth } from '@/lib/firebase';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      setName(user.displayName || '');
    }
  }, [user, loading]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);

      // Update display name if changed
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update password if provided
      if (newPassword && currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      toast.success('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error(error.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
      <Navigation />
      <main className="container max-w-md mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <User className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Profile Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to change it"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}