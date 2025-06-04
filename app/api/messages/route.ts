import { NextRequest, NextResponse } from 'next/server';
import { Message, ApiResponse } from '../../../types';

let messages: Message[] = []; // In-memory store (use database in production)

export async function GET(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json({ messages });
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
    
    const newMessage: Message = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    return NextResponse.json(
      { 
        message: 'Message added successfully', 
        data: newMessage 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
