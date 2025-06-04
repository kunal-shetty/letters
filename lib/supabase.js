import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database functions for messages
export const messagesService = {
  // Get all messages
  async getMessages(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching messages:', error)
      return { success: false, error: error.message }
    }
  },

  // Save a new message
  async saveMessage(content, senderName = null, senderEmail = null) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: content.trim(),
            sender_name: senderName,
            sender_email: senderEmail
          }
        ])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving message:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error deleting message:', error)
      return { success: false, error: error.message }
    }
  },

  // Update a message
  async updateMessage(messageId, content) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ 
          content: content.trim(), 
          updated_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating message:', error)
      return { success: false, error: error.message }
    }
  },

  // Subscribe to real-time changes
  subscribeToMessages(callback) {
    const subscription = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        callback
      )
      .subscribe()

    return subscription
  }
}