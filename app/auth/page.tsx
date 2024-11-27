"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-service';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await signIn({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      toast.success('Signed in successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await signUp({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            IceBot
          </h1>
          <p className="text-muted-foreground">
            Turning Conversations into Connections!
          </p>
        </div>

        <div className="bg-card border rounded-2xl shadow-lg overflow-hidden">
          <Tabs defaultValue="signin" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-2 h-12 items-center gap-4 rounded-xl bg-muted/50 p-1">
                <TabsTrigger 
                  value="signin" 
                  className="h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 px-2">
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">Sign In</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="h-10 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 px-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Sign Up</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="signin" className="p-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="h-11"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="h-11"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}