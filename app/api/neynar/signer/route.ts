import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

export default async function POST(req: NextRequest) {
    const response = await fetch('https://api.neynar.com/v2/farcaster/signer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
        },
    });

    const data = await response.json();
    console.log('Neynar create signer data:', data);
    return NextResponse.json(data);
}