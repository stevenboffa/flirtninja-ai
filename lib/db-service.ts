import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Conversation, SavedMessage } from './types';
import { auth } from './firebase';

const CONVERSATIONS_COLLECTION = 'conversations';
const SAVED_MESSAGES_COLLECTION = 'savedMessages';

// Conversation functions
export async function getConversations(): Promise<Conversation[]> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp instanceof Timestamp 
        ? doc.data().timestamp.toDate().toISOString() 
        : doc.data().timestamp
    } as Conversation));
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
}

export async function addConversation(conversation: Partial<Conversation>): Promise<string> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
      ...conversation,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      messages: [],
      lastMessage: ''
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding conversation:', error);
    throw error;
  }
}

export async function updateConversation(id: string, data: Partial<Conversation>): Promise<void> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const docRef = doc(db, CONVERSATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
}

export async function deleteConversation(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    await deleteDoc(doc(db, CONVERSATIONS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

export async function updateConversationOrder(conversations: Conversation[]): Promise<void> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const batch = writeBatch(db);
    
    conversations.forEach((conversation) => {
      const docRef = doc(db, CONVERSATIONS_COLLECTION, conversation.id);
      batch.update(docRef, { 
        order: conversation.order,
        timestamp: serverTimestamp()
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating conversation order:', error);
    throw error;
  }
}

// Saved messages functions
export async function getSavedMessages(): Promise<SavedMessage[]> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const q = query(
      collection(db, SAVED_MESSAGES_COLLECTION),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp instanceof Timestamp 
        ? doc.data().timestamp.toDate().toISOString() 
        : new Date().toISOString()
    } as SavedMessage));
  } catch (error) {
    console.error('Error getting saved messages:', error);
    throw error;
  }
}

export async function addSavedMessage(text: string): Promise<string> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const messageData = {
      text,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      success: false
    };

    const docRef = await addDoc(collection(db, SAVED_MESSAGES_COLLECTION), messageData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function deleteSavedMessage(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    await deleteDoc(doc(db, SAVED_MESSAGES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting saved message:', error);
    throw error;
  }
}

export async function updateSavedMessageSuccess(id: string, success: boolean): Promise<void> {
  if (!auth.currentUser) throw new Error('Not authenticated');

  try {
    const docRef = doc(db, SAVED_MESSAGES_COLLECTION, id);
    await updateDoc(docRef, {
      success,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating saved message:', error);
    throw error;
  }
}