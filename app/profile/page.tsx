"use client";

import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/navigation';

interface ProfileSettings {
  name: string;
  age: string;
  gender: string;
  location: string;
  seeking: string;
  intention: string;
  slangLevel: string;
}

const defaultSettings: ProfileSettings = {
  name: '',
  age: '',
  gender: '',
  location: '',
  seeking: '',
  intention: '',
  slangLevel: 'moderate'
};

export default function Profile() {
  const router = useRouter();
  const [settings, setSettings] = useState<ProfileSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('profile-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    if (!settings.name || !settings.age || !settings.gender || !settings.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    localStorage.setItem('profile-settings', JSON.stringify(settings));
    toast.success('Profile settings saved!');
  };

  return (
    <>
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <User className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Profile Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Customize how IceBot generates messages for you
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Tell us about yourself to help generate better ice breakers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    min="18"
                    max="100"
                    value={settings.age}
                    onChange={(e) => setSettings({ ...settings, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={settings.gender}
                    onValueChange={(value) => setSettings({ ...settings, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seeking">Seeking</Label>
                <Select
                  value={settings.seeking}
                  onValueChange={(value) => setSettings({ ...settings, seeking: value })}
                >
                  <SelectTrigger id="seeking">
                    <SelectValue placeholder="Who are you interested in?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Men</SelectItem>
                    <SelectItem value="female">Women</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intention">What are you looking for?</Label>
                <Select
                  value={settings.intention}
                  onValueChange={(value) => setSettings({ ...settings, intention: value })}
                >
                  <SelectTrigger id="intention">
                    <SelectValue placeholder="Select your intention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long-term">Long-term Relationship</SelectItem>
                    <SelectItem value="casual">Quick Fling</SelectItem>
                    <SelectItem value="friends">Friendships</SelectItem>
                    <SelectItem value="unsure">Not Sure Yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slang">Slang Preference</Label>
                <Select
                  value={settings.slangLevel}
                  onValueChange={(value) => setSettings({ ...settings, slangLevel: value })}
                >
                  <SelectTrigger id="slang">
                    <SelectValue placeholder="Select slang level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lots">Lots of Slang</SelectItem>
                    <SelectItem value="moderate">Moderate Slang</SelectItem>
                    <SelectItem value="proper">Proper English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}