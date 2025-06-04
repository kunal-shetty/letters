// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { Message, ApiResponse } from '../../../types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const searchName = searchParams.get('name');
    
    let query = supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });
    
    // If searching for a specific name, filter by name
    if (searchName) {
      query = query.ilike('name', `%${searchName}%`);
    }
    
    const { data: messages, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const { name, message }: { name?: string; message?: string } = body;
    
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: name.trim(),
          message: message.trim(),
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Message added successfully', 
        data: data 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}