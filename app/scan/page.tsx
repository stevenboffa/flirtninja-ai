"use client";

import { useState } from 'react';
import { Upload, Image as ImageIcon, Camera, Bot, ThumbsUp, ThumbsDown, RefreshCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import { analyzeProfileImage } from '@/lib/vision-service';
import { generateAIMessage } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

export default function ScanProfile() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image size should be less than 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setGeneratedMessage('');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const analyzeProfile = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setGeneratedMessage('');
      
      const analysisResult = await analyzeProfileImage(selectedImage);
      
      // Generate ice breaker based on analysis
      setIsGenerating(true);
      const message = await generateAIMessage({
        profile: analysisResult,
        messageStyle: {
          funny: true,
          flirty: true,
          serious: false,
          pervy: false,
          corny: false,
          knockKnock: false,
          cooking: false,
          question: true
        }
      });
      setGeneratedMessage(message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  };

  const regenerateMessage = async () => {
    if (!selectedImage) return;

    try {
      setIsGenerating(true);
      const analysisResult = await analyzeProfileImage(selectedImage);
      const message = await generateAIMessage({
        profile: analysisResult,
        messageStyle: {
          funny: true,
          flirty: true,
          serious: false,
          pervy: false,
          corny: false,
          knockKnock: false,
          cooking: false,
          question: true
        }
      });
      setGeneratedMessage(message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVote = (isUpvote: boolean) => {
    if (isUpvote) {
      const saved = JSON.parse(localStorage.getItem('savedMessages') || '[]');
      localStorage.setItem('savedMessages', JSON.stringify([...saved, generatedMessage]));
      toast.success('Message saved!');
    } else {
      toast.info('Thanks for the feedback!');
    }
    setGeneratedMessage('');
    setSelectedImage(null);
  };

  return (
    <>
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Camera className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Scan Profile
              </h1>
            </div>
            <p className="text-muted-foreground">
              Upload a profile picture to generate a personalized ice breaker
            </p>
          </div>

          <div className="gradient-border p-6 space-y-6 bg-card">
            <div 
              className={cn(
                "relative w-full aspect-[3/2] rounded-lg transition-all duration-200",
                !selectedImage && "border-2 border-dashed",
                dragActive && "border-primary ring-2 ring-primary ring-offset-2",
                !selectedImage && "bg-muted/50 hover:bg-muted/70"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 mb-4 text-primary/50" />
                  <div className="text-center space-y-2 px-4">
                    <p className="font-medium">
                      Drop your image here or click to upload
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, GIF • Maximum size: 4MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              size="lg"
              onClick={analyzeProfile}
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Analyze Profile
                </>
              )}
            </Button>
          </div>

          {generatedMessage && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="p-6 rounded-lg border bg-card shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-lg">{generatedMessage}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={regenerateMessage}
                    disabled={isGenerating}
                    className="shrink-0 text-muted-foreground hover:text-primary"
                  >
                    <RefreshCcw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </Button>
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
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}