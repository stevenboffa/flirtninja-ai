"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, GripVertical, Heart } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/components/auth-provider';
import { getSavedMessages, deleteSavedMessage, updateSavedMessageSuccess } from '@/lib/db-service';
import { SavedMessage } from '@/lib/types';
import { format } from 'date-fns';

export default function SavedMessages() {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await getSavedMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load saved messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedMessage(id);
      await loadMessages();
      toast.success('Message deleted!');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const toggleSuccess = async (id: string, currentSuccess: boolean) => {
    try {
      await updateSavedMessageSuccess(id, !currentSuccess);
      await loadMessages();
      toast.success('Success status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'successful') return message.success;
    if (filter === 'pending') return !message.success;
    return true;
  });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-20 px-4 pb-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Saved Ice Breakers
            </h1>
            <p className="text-muted-foreground">
              Your collection of successful ice breakers
            </p>
          </div>

          <div className="flex justify-end">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter messages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="group p-6 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-lg">{message.text}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {format(new Date(message.timestamp), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSuccess(message.id, message.success)}
                      className={message.success ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 ${message.success ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(message.text)}
                      className="hover:text-primary transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(message.id)}
                      className="hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12 border rounded-lg bg-card">
              <p className="text-lg">No saved messages yet</p>
              <p className="text-sm">Start by generating some ice breakers!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}