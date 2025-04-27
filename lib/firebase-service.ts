import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  increment 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// User related functions
export const createUserProfile = async (userId: string, userData: any) => {
  await addDoc(collection(db, 'users'), {
    userId,
    ...userData,
    trees: 0,
    coins: 0,
    streak: 0,
    createdAt: new Date().toISOString(),
  });
};

export const updateUserProfile = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData);
};

// Tree planting related functions
export const addTreePlanting = async (userId: string, treeData: any) => {
  try {
    const treeRef = await addDoc(collection(db, 'trees'), {
      userId,
      ...treeData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Update user's tree count and coins
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      trees: increment(1),
      coins: increment(100), // Award 100 coins per tree
    });

    return treeRef.id;
  } catch (error: any) {
    if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      throw new Error('Operation blocked by browser extension. Please disable ad blockers or privacy extensions for localhost:3000');
    }
    throw error;
  }
};

export const verifyTreePlanting = async (treeId: string) => {
  const treeRef = doc(db, 'trees', treeId);
  await updateDoc(treeRef, {
    status: 'verified',
    verifiedAt: new Date().toISOString(),
  });
};

// Reward related functions
export const redeemReward = async (userId: string, rewardId: string, quantity: number) => {
  const rewardRef = doc(db, 'rewards', rewardId);
  const rewardDoc = await getDoc(rewardRef);
  const rewardData = rewardDoc.data();

  if (!rewardData) throw new Error('Reward not found');

  const totalCost = rewardData.cost * quantity;

  // Update user's coins
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    coins: increment(-totalCost),
  });

  // Record the redemption
  await addDoc(collection(db, 'redemptions'), {
    userId,
    rewardId,
    quantity,
    cost: totalCost,
    createdAt: new Date().toISOString(),
  });
};

// Leaderboard related functions
export const getLeaderboard = async (timeFilter: string = 'all') => {
  let q = query(collection(db, 'users'));
  
  if (timeFilter === 'month') {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    q = query(q, where('lastActive', '>=', lastMonth.toISOString()));
  } else if (timeFilter === 'week') {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    q = query(q, where('lastActive', '>=', lastWeek.toISOString()));
  }

  q = query(q, orderBy('trees', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Image upload function
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: file.type,
    };
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  } catch (error: any) {
    if (error.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      throw new Error('Upload blocked by browser extension. Please disable ad blockers or privacy extensions for localhost:3000');
    }
    throw error;
  }
};

export async function addTree(userId: string, treeData: {
  timestamp: string
  imageUrl: string
  location: string
  species: string
}) {
  const db = getFirestore()
  const treesRef = collection(db, "users", userId, "trees")
  
  const treeDoc = await addDoc(treesRef, {
    ...treeData,
    verified: true,
    coins: 100, // Base reward for planting a tree
  })

  // Update user's total trees count
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    trees: increment(1),
    coins: increment(100),
  })

  return treeDoc.id
} 