"use client";

import { Crown, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PremiumPage() {
  return (
    <>
      <Navigation />
      <main className="container max-w-4xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                FlirtNinja Premium
              </h1>
            </div>
            <p className="text-muted-foreground">
              Unlock advanced features and become a master of conversation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-0 right-0 p-3">
                <div className="text-muted-foreground text-sm font-medium">
                  BASIC
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Free Plan</CardTitle>
                <CardDescription>
                  Get started with basic features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0</div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Basic message generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Limited conversation history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Standard response time</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative overflow-hidden border-2 border-primary bg-primary/5">
              <div className="absolute top-0 right-0 p-3">
                <div className="text-primary text-sm font-medium">
                  PREMIUM
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <CardDescription>
                  Unlock all premium features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  $9.99
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Advanced AI message generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Unlimited conversation simulations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Priority response generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Advanced conversation analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Exclusive message templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>24/7 Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                  Upgrade to Pro
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Why Go Premium?</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced AI</CardTitle>
                </CardHeader>
                <CardContent>
                  Access our most sophisticated AI models for better message generation
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">No Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  Generate unlimited messages and practice conversations
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Priority Support</CardTitle>
                </CardHeader>
                <CardContent>
                  Get help when you need it with 24/7 premium support
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}