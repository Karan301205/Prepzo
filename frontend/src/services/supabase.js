import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Called on every sign-in
export async function upsertUser(clerkUser) {
  try {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        full_name: clerkUser.fullName || '',
      });

    if (insertError && insertError.code === '23505') {
      // User exists — update last_seen_at
      await supabase
        .from('users')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('clerk_user_id', clerkUser.id);
    } else if (insertError) {
      console.error('upsertUser error:', insertError.message);
    }
  } catch (e) {
    console.error('upsertUser exception:', e);
  }
}

// Save generated plan
export async function savePlan(clerkUserId, subject, examDate, planData) {
  try {
    const { error } = await supabase
      .from('plans')
      .insert({
        clerk_user_id: clerkUserId,
        subject,
        exam_date: examDate,
        mode: planData.mode,
        topics: planData.focusTopics || [],
        plan_json: planData,
      });
    if (error) console.error('savePlan error:', error.message);
  } catch (e) {
    console.error('savePlan exception:', e);
  }
}

// Get all past plans for a user
export async function getUserPlans(clerkUserId) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false });
    if (error) console.error('getUserPlans error:', error.message);
    return data || [];
  } catch (e) {
    console.error('getUserPlans exception:', e);
    return [];
  }
}

// Submit feedback — saves to Supabase feedback table
export async function submitFeedback({ clerkUserId, userEmail, rating, comment, context, planMode, subject }) {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert({
        clerk_user_id: clerkUserId || null,
        user_email: userEmail || null,
        rating,           // 1–5
        comment: comment?.trim() || null,
        context,          // 'result' | 'chat' | 'general'
        plan_mode: planMode || null,
        subject: subject || null,
      });
    if (error) {
      console.error('submitFeedback error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.error('submitFeedback exception:', e);
    return { success: false, error: e.message };
  }
}

// Get all feedback (for displaying to users)
export async function getAllFeedback() {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, comment, context, plan_mode, subject, user_email, created_at')
      .order('created_at', { ascending: false });
    if (error) console.error('getAllFeedback error:', error.message);
    return data || [];
  } catch (e) {
    console.error('getAllFeedback exception:', e);
    return [];
  }
}