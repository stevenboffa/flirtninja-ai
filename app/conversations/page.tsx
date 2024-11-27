"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, Plus, ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navigation from '@/components/navigation';
import ConversationDialog from '@/components/conversation-dialog';
import { Conversation } from '@/lib/types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth-provider';
import { getConversations, addConversation, deleteConversation, updateConversationOrder } from '@/lib/db-service';

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newName, setNewName] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddConversation = async () => {
    if (!newName.trim()) {
      toast.error('Please enter their name');
      return;
    }

    try {
      const newConversation: Partial<Conversation> = {
        name: newName.trim(),
        messages: [],
        lastMessage: '',
        timestamp: new Date().toISOString(),
        userId: user!.uid,
        order: conversations.length
      };

      await addConversation(newConversation);
      await loadConversations();
      setNewName('');
      setIsAddOpen(false);
      toast.success('New chat started!');
    } catch (error) {
      console.error('Error adding conversation:', error);
      toast.error('Failed to create conversation');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      await loadConversations();
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev =>
      prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
    );
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(conversations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setConversations(updatedItems);

    try {
      await updateConversationOrder(updatedItems);
    } catch (error) {
      toast.error('Failed to update order');
      await loadConversations();
    }
  };

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
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Conversation Simulator
              </h1>
            </div>
            <p className="text-muted-foreground">
              Start a simulated conversation with your match by opening a new chat. Enter their messages to practice and refine your responses.
            </p>
          </div>

          <div className="flex justify-center">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Chat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Their Name
                    </label>
                    <Input
                      placeholder="Enter their name..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddConversation}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="conversations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {conversations.map((conversation, index) => (
                    <Draggable
                      key={conversation.id}
                      draggableId={conversation.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="group border rounded-lg bg-card transition-all hover:shadow-md"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-1 text-muted-foreground cursor-grab hover:text-primary transition-colors"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <h3 className="text-lg font-medium">
                                    {conversation.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="secondary" 
                                      className="shrink-0 font-normal"
                                    >
                                      {conversation.messages.length} messages
                                    </Badge>
                                    {conversation.timestamp && (
                                      <Badge 
                                        variant="outline" 
                                        className="shrink-0 font-normal text-muted-foreground"
                                      >
                                        {format(new Date(conversation.timestamp), 'MMM d, yyyy')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                {conversation.lastMessage && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.lastMessage}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setExpandedId(
                                    expandedId === conversation.id ? null : conversation.id
                                  )}
                                  className="hover:text-primary transition-colors"
                                >
                                  {expandedId === conversation.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(conversation.id)}
                                  className="hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {expandedId === conversation.id && (
                            <ConversationDialog
                              conversation={conversation}
                              onUpdate={updateConversation}
                              onClose={() => setExpandedId(null)}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {conversations.length === 0 && (
            <div className="text-center text-muted-foreground py-12 border rounded-lg bg-card">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-primary/50" />
              <p className="text-lg">No chats yet</p>
              <p className="text-sm">Start a new conversation to get AI-powered responses!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}