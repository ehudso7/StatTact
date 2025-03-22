import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team');
  const opponent = searchParams.get('opponent');
  
  // Update to use port 9000 for your backend
  const backendUrl = 'http://localhost:9000';
  
  console.log(`Forwarding request to: ${backendUrl}/generate-formation?team=${team}&opponent=${opponent || ''}`);
  
  try {
    const response = await fetch(
      `${backendUrl}/generate-formation?team=${encodeURIComponent(team)}&opponent=${encodeURIComponent(opponent || '')}`,
      {
        headers: {
          'Accept': 'application/json'
        },
      }
    );
    
    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error.message);
    return NextResponse.json(
      { result: "⚠️ Error generating tactics. Please try again. Server may be offline." },
      { status: 500 }
    );
  }
}
