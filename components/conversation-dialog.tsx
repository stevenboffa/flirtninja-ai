"use client";

import { useState } from 'react';
import { RefreshCcw, Send, MessageSquare, Keyboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Conversation, Message } from '@/lib/types';
import { generateAIMessage, enhanceMessage, recordRegeneratedResponse } from '@/lib/ai-service';
import { Separator } from '@/components/ui/separator';
import { updateConversation } from '@/lib/db-service';

interface ConversationDialogProps {
  conversation: Conversation;
  onUpdate: (conversation: Conversation) => void;
  onClose: () => void;
}

export default function ConversationDialog({
  conversation,
  onUpdate,
  onClose,
}: ConversationDialogProps) {
  const [newMessage, setNewMessage] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const addMessage = async (text: string, isMatch: boolean = false, isAIGenerated: boolean = false) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isMatch,
      isAIGenerated,
      timestamp: new Date().toISOString(),
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMsg],
      lastMessage: text.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await updateConversation(conversation.id, updatedConversation);
      onUpdate(updatedConversation);
      setNewMessage('');
      setMatchMessage('');
      setShowManualInput(false);
      toast.success(isMatch ? 'Their message added!' : 'Message added!');
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  const generateNewMessage = async () => {
    try {
      setIsGenerating(true);
      const lastMatchMessage = [...conversation.messages]
        .reverse()
        .find(msg => msg.isMatch)?.text;

      if (!lastMatchMessage) {
        toast.error('Add their message first to get a response');
        return;
      }

      const response = await generateAIMessage({
        profile: lastMatchMessage,
        messageStyle: {
          funny: true,
          serious: false,
          flirty: true,
          foodie: false,
          travel: false,
          pervy: false,
          corny: false,
          knockKnock: false,
          popCulture: false,
          humorousScenarios: false,
          asshole: false
        }
      });
      await addMessage(response, false, true);
    } catch (error) {
      toast.error('Failed to generate response');
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceManualMessage = async (messageId: string, originalText: string) => {
    try {
      setIsGenerating(true);
      setEnhancingId(messageId);

      const enhancedMessage = await enhanceMessage(originalText);
      
      const updatedMessages = conversation.messages.map(msg => 
        msg.id === messageId ? { ...msg, text: enhancedMessage, isAIEnhanced: true } : msg
      );

      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
        lastMessage: enhancedMessage,
        timestamp: new Date().toISOString(),
      };

      await updateConversation(conversation.id, updatedConversation);
      onUpdate(updatedConversation);
      toast.success('Message enhanced!');
    } catch (error) {
      toast.error('Failed to enhance message');
    } finally {
      setIsGenerating(false);
      setEnhancingId(null);
    }
  };

  const regenerateResponse = async (messageId: string) => {
    try {
      setIsGenerating(true);
      setRegeneratingId(messageId);
      
      const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
      const previousMatchMessage = conversation.messages
        .slice(0, messageIndex)
        .reverse()
        .find(msg => msg.isMatch)?.text;

      if (!previousMatchMessage) {
        toast.error('No previous message to respond to');
        return;
      }

      const oldMessage = conversation.messages.find(m => m.id === messageId)?.text;
      if (oldMessage) {
        recordRegeneratedResponse(oldMessage);
      }

      const response = await generateAIMessage({
        profile: previousMatchMessage,
        messageStyle: {
          funny: true,
          serious: false,
          flirty: true,
          foodie: false,
          travel: false,
          pervy: false,
          corny: false,
          knockKnock: false,
          popCulture: false,
          humorousScenarios: false,
          asshole: false
        }
      });
      
      const updatedMessages = conversation.messages.map(msg => 
        msg.id === messageId ? { ...msg, text: response } : msg
      );

      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
        lastMessage: response,
        timestamp: new Date().toISOString(),
      };

      await updateConversation(conversation.id, updatedConversation);
      onUpdate(updatedConversation);
      toast.success('Response regenerated!');
    } catch (error) {
      toast.error('Failed to generate response');
    } finally {
      setIsGenerating(false);
      setRegeneratingId(null);
    }
  };

  const latestMessageId = [...conversation.messages]
    .reverse()
    .find(msg => !msg.isMatch)?.id;

  return (
    <div className="border-t bg-muted/30">
      <div className="p-4 space-y-6">
        {/* Messages Section */}
        <div className="bg-background rounded-lg p-4 shadow-sm">
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.isMatch ? 'justify-start' : 'justify-end'} group`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg ${
                    message.isMatch
                      ? 'bg-secondary'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                </div>
                {!message.isMatch && message.id === latestMessageId && (
                  message.isAIGenerated ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary ${isGenerating && regeneratingId === message.id ? 'opacity-100 text-primary' : ''}`}
                      onClick={() => regenerateResponse(message.id)}
                      disabled={isGenerating}
                    >
                      <RefreshCcw className={`h-4 w-4 ${isGenerating && regeneratingId === message.id ? 'animate-spin' : ''}`} />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary ${isGenerating && enhancingId === message.id ? 'opacity-100 text-primary' : ''}`}
                      onClick={() => enhanceManualMessage(message.id, message.text)}
                      disabled={isGenerating}
                    >
                      <Sparkles className={`h-4 w-4 ${isGenerating && enhancingId === message.id ? 'animate-spin' : ''}`} />
                    </Button>
                  )
                )}
              </div>
            ))}
            {isGenerating && !regeneratingId && !enhancingId && (
              <div className="flex justify-end">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Input Section */}
        <div className="space-y-4">
          {/* Their Message Input */}
          <div className="bg-background rounded-lg p-4 shadow-sm space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Their Message
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Paste their message here..."
                value={matchMessage}
                onChange={(e) => setMatchMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addMessage(matchMessage, true);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => addMessage(matchMessage, true)}
                disabled={!matchMessage.trim()}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Response Options */}
          <div className="bg-background rounded-lg p-4 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                onClick={generateNewMessage}
                disabled={isGenerating}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate AI Response
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex-1"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Write Manual Response
              </Button>
            </div>

            {/* Manual Input Field */}
            {showManualInput && (
              <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-5">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => addMessage(newMessage, false, false)}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}