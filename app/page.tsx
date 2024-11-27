"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ThumbsUp, ThumbsDown, Sparkles, Bot, Copy } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import { generateAIMessage } from '@/lib/ai-service';
import { addSavedMessage } from '@/lib/db-service';
import { useAuth } from '@/components/auth-provider';

interface MessageStyle {
  funny: boolean;
  serious: boolean;
  flirty: boolean;
  foodie: boolean;
  travel: boolean;
  pervy: boolean;
  corny: boolean;
  knockKnock: boolean;
  popCulture: boolean;
  humorousScenarios: boolean;
  asshole: boolean;
}

export default function HomePage() {
  const [profile, setProfile] = useState('');
  const [messageStyle, setMessageStyle] = useState<MessageStyle>({
    funny: false,
    serious: false,
    flirty: false,
    foodie: false,
    travel: false,
    pervy: false,
    corny: false,
    knockKnock: false,
    popCulture: false,
    humorousScenarios: false,
    asshole: false
  });
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const toggleStyle = (style: keyof MessageStyle) => {
    if (style === 'asshole') {
      setMessageStyle(prev => ({
        ...Object.keys(prev).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {} as MessageStyle),
        asshole: !prev.asshole
      }));
    } else if (messageStyle.asshole) {
      return;
    } else {
      setMessageStyle(prev => ({
        ...prev,
        [style]: !prev[style]
      }));
    }
  };

  const generateMessage = async () => {
    try {
      setIsGenerating(true);
      const message = await generateAIMessage({
        profile,
        messageStyle
      });
      setGeneratedMessage(message);
    } catch (error) {
      toast.error('Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success('Message copied to clipboard!');
  };

  const handleVote = async (isUpvote: boolean) => {
    if (!generatedMessage) return;

    try {
      if (isUpvote) {
        await addSavedMessage(generatedMessage);
        toast.success('Message saved!');
      } else {
        toast.info('Thanks for the feedback! This helps FlirtNinja learn.');
      }
      setGeneratedMessage('');
    } catch (error) {
      toast.error('Failed to save message');
    }
  };

  return (
    <>
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                FlirtNinja.ai
              </h1>
            </div>
            <p className="text-muted-foreground">
              Your AI wingman for creating perfect ice breakers
            </p>
          </div>

          <div className="gradient-border p-6 space-y-6 bg-card">
            <Textarea
              placeholder="Copy and paste their profile description here. Leave blank if they have no description."
              className="min-h-[150px] resize-none"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
            />

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Style</label>
                <div className="flex flex-wrap gap-2">
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.funny}
                    onPressedChange={() => toggleStyle('funny')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Funny
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.serious}
                    onPressedChange={() => toggleStyle('serious')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Serious
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.flirty}
                    onPressedChange={() => toggleStyle('flirty')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Flirty
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.foodie}
                    onPressedChange={() => toggleStyle('foodie')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Foodie
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.travel}
                    onPressedChange={() => toggleStyle('travel')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Travel
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.pervy}
                    onPressedChange={() => toggleStyle('pervy')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Pervy
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.corny}
                    onPressedChange={() => toggleStyle('corny')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Corny
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.knockKnock}
                    onPressedChange={() => toggleStyle('knockKnock')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Knock Knock
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.popCulture}
                    onPressedChange={() => toggleStyle('popCulture')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Pop Culture
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.humorousScenarios}
                    onPressedChange={() => toggleStyle('humorousScenarios')}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white"
                    disabled={messageStyle.asshole}
                  >
                    Humorous Scenarios
                  </Toggle>
                  <Toggle
                    variant="outline"
                    pressed={messageStyle.asshole}
                    onPressedChange={() => toggleStyle('asshole')}
                    className="data-[state=on]:bg-destructive data-[state=on]:text-white bg-destructive/10 hover:bg-destructive/20 text-destructive"
                  >
                    Asshole
                  </Toggle>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              size="lg"
              onClick={generateMessage}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'FlirtNinja is thinking...' : 'Generate Message'}
            </Button>
          </div>

          {generatedMessage && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="p-6 rounded-lg border bg-card shadow-sm">
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 mt-1 text-primary shrink-0" />
                  <p className="text-lg">{generatedMessage}</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleVote(true)}
                  className="hover:border-green-500 hover:text-green-500 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleVote(false)}
                  className="hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Skip
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToClipboard}
                  className="hover:border-primary hover:text-primary transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}