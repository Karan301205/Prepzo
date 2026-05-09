import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Called on every sign-in — creates user row if new, updates last_seen if returning
export async function upsertUser(clerkUser) {
  try {
    // First try to insert
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        full_name: clerkUser.fullName || '',
      });

    // If duplicate (user exists), update last_seen_at instead
    if (insertError && insertError.code === '23505') {
      await supabase
        .from('users')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('clerk_user_id', clerkUser.id);
    } else if (insertError) {
      console.error('upsertUser insert error:', insertError.message);
    }
  } catch (e) {
    console.error('upsertUser exception:', e);
  }
}

// Called after plan is generated — saves full plan to DB
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
    if (error) console.error('Supabase savePlan error:', error.message);
  } catch (e) {
    console.error('Supabase savePlan exception:', e);
  }
}

// Get all past plans for a user (for analytics/history)
export async function getUserPlans(clerkUserId) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false });
    if (error) console.error('Supabase getUserPlans error:', error.message);
    return data || [];
  } catch (e) {
    console.error('Supabase getUserPlans exception:', e);
    return [];
  }
}
