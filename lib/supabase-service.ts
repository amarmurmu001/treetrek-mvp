import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Types
export interface Tree {
  id: string;
  user_id: string;
  species: string;
  location: string;
  description?: string;
  tree_photo?: string;
  selfie?: string;
  coordinates?: { lat: number; lng: number };
  status: 'pending' | 'verified';
  created_at: string;
  verified_at?: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  cost: number;
  image_url?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  requirement: number;
  type: 'trees' | 'coins' | 'streak';
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

// User related functions
export const createUserProfile = async (userId: string, userData: any) => {
  const { error } = await supabase
    .from('users')
    .insert([{
      id: userId,
      name: userData.name,
      email: userData.email,
      trees: 0,
      coins: 0,
      streak: 0,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    }]);

  if (error) throw error;
};

export const updateUserProfile = async (userId: string, userData: any) => {
  const { error } = await supabase
    .from('users')
    .update({
      ...userData,
      last_active: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Tree planting related functions
export const addTreePlanting = async (userId: string, treeData: Partial<Tree>) => {
  try {
    // Insert tree planting record
    const { data: tree, error: treeError } = await supabase
      .from('trees')
      .insert([{
        user_id: userId,
        species: treeData.species,
        location: treeData.location,
        description: treeData.description,
        tree_photo: treeData.tree_photo,
        selfie: treeData.selfie,
        coordinates: treeData.coordinates,
        status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (treeError) {
      console.error('Error creating tree record:', treeError);
      throw new Error(treeError.message);
    }

    // Update user's tree count and coins
    const { error: userError } = await supabase.rpc('increment_user_stats', {
      user_id: userId,
      tree_count: 1,
      coin_amount: 100
    });

    if (userError) {
      console.error('Error updating user stats:', userError);
      throw new Error(userError.message);
    }

    // Check for new achievements
    await supabase.rpc('check_achievements', {
      user_id: userId
    });

    return tree;
  } catch (error: any) {
    console.error('Error in addTreePlanting:', error);
    throw error;
  }
};

export const verifyTreePlanting = async (treeId: string) => {
  const { error } = await supabase
    .from('trees')
    .update({
      status: 'verified',
      verified_at: new Date().toISOString(),
    })
    .eq('id', treeId);

  if (error) throw error;
};

export const getUserTrees = async (userId: string) => {
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Tree[];
};

// Reward related functions
export const getRewards = async () => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .order('cost', { ascending: true });

  if (error) throw error;
  return data as Reward[];
};

export const redeemReward = async (userId: string, rewardId: string, quantity: number) => {
  const { data: reward, error: rewardError } = await supabase
    .from('rewards')
    .select('cost')
    .eq('id', rewardId)
    .single();

  if (rewardError) throw rewardError;

  const totalCost = reward.cost * quantity;

  const { error: redemptionError } = await supabase.rpc('redeem_reward', {
    p_user_id: userId,
    p_reward_id: rewardId,
    p_quantity: quantity,
    p_total_cost: totalCost
  });

  if (redemptionError) throw redemptionError;
};

export const getUserRedemptions = async (userId: string) => {
  const { data, error } = await supabase
    .from('redemptions')
    .select(`
      *,
      reward:rewards(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Achievement related functions
export const getAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('requirement', { ascending: true });

  if (error) throw error;
  return data as Achievement[];
};

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data as UserAchievement[];
};

// Leaderboard related functions
export const getLeaderboard = async (timeFilter: string = 'all') => {
  let query = supabase
    .from('users')
    .select('id, name, trees, coins, streak, last_active')
    .order('trees', { ascending: false })
    .limit(100);

  if (timeFilter === 'month') {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    query = query.gte('last_login', lastMonth.toISOString());
  } else if (timeFilter === 'week') {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    query = query.gte('last_login', lastWeek.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Image upload function
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trees')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('trees')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const addTree = async (userId: string, treeData: {
  timestamp: string
  imageUrl: string
  location: string
  species: string
}) => {
  const { data, error: treeError } = await supabase
    .from('trees')
    .insert([{
      user_id: userId,
      ...treeData,
      verified: true,
      coins: 100,
    }])
    .select()
    .single();

  if (treeError) throw treeError;

  const { error: statsError } = await supabase.rpc('increment_user_stats', {
    user_id: userId,
    tree_count: 1,
    coin_amount: 100
  });

  if (statsError) throw statsError;

  return data.id;
}; 