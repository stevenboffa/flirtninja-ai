"use client";

import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import { generateProfileDescription } from '@/lib/profile-service';

interface ProfileStyle {
  funny: boolean;
  mysterious: boolean;
  intellectual: boolean;
  adventurous: boolean;
  romantic: boolean;
  ambitious: boolean;
  creative: boolean;
  athletic: boolean;
}

export default function GenerateProfile() {
  const [profileStyle, setProfileStyle] = useState<ProfileStyle>({
    funny: false,
    mysterious: false,
    intellectual: false,
    adventurous: false,
    romantic: false,
    ambitious: false,
    creative: false,
    athletic: false
  });

  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('casual');
  const [generatedProfile, setGeneratedProfile] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleStyle = (style: keyof ProfileStyle) => {
    setProfileStyle(prev => ({
      ...prev,
      [style]: !prev[style]
    }));
  };

  const generateProfile = async () => {
    try {
      setIsGenerating(true);
      const profile = await generateProfileDescription({
        profileStyle,
        length,
        tone
      });
      setGeneratedProfile(profile);
    } catch (error) {
      toast.error('Failed to generate profile. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedProfile);
    toast.success('Profile copied to clipboard!');
  };

  return (
    <>
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Profile Generator
              </h1>
            </div>
            <p className="text-muted-foreground">
              Create the perfect dating profile description
            </p>
          </div>

          <div className="gradient-border p-6 space-y-6 bg-card">
            <div className="space-y-4">
              <label className="text-sm font-medium">Profile Style</label>
              <div className="flex flex-wrap gap-2">
                <Toggle
                  variant="outline"
                  pressed={profileStyle.funny}
                  onPressedChange={() => toggleStyle('funny')}
                  className="data-[state=on]:bg-amber-500 data-[state=on]:text-white"
                >
                  😄 Funny
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.mysterious}
                  onPressedChange={() => toggleStyle('mysterious')}
                  className="data-[state=on]:bg-purple-500 data-[state=on]:text-white"
                >
                  🎭 Mysterious
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.intellectual}
                  onPressedChange={() => toggleStyle('intellectual')}
                  className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                >
                  🎓 Intellectual
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.adventurous}
                  onPressedChange={() => toggleStyle('adventurous')}
                  className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                >
                  🏃‍♂️ Adventurous
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.romantic}
                  onPressedChange={() => toggleStyle('romantic')}
                  className="data-[state=on]:bg-rose-500 data-[state=on]:text-white"
                >
                  💝 Romantic
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.ambitious}
                  onPressedChange={() => toggleStyle('ambitious')}
                  className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                >
                  🎯 Ambitious
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.creative}
                  onPressedChange={() => toggleStyle('creative')}
                  className="data-[state=on]:bg-pink-500 data-[state=on]:text-white"
                >
                  🎨 Creative
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={profileStyle.athletic}
                  onPressedChange={() => toggleStyle('athletic')}
                  className="data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                >
                  🏋️‍♂️ Athletic
                </Toggle>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short & Sweet</SelectItem>
                    <SelectItem value="medium">Medium Length</SelectItem>
                    <SelectItem value="long">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="playful">Fun & Playful</SelectItem>
                    <SelectItem value="sophisticated">Sophisticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              size="lg"
              onClick={generateProfile}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Profile'}
            </Button>
          </div>

          {generatedProfile && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="p-6 rounded-lg border bg-card shadow-sm">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-1 text-primary shrink-0" />
                  <p className="text-lg whitespace-pre-wrap">{generatedProfile}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  className="hover:border-primary hover:text-primary transition-colors"
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}