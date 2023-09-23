import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('q');
    const url = new URL('https://api.neynar.com/v2/farcaster/user/search');
    url.searchParams.append('viewer_fid', '2455');
    url.searchParams.append('q', query || '');
    url.searchParams.append('api_key', NEYNAR_API_KEY);

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    const data = await res.json();
    console.log('Neynar search user:', data);
    return NextResponse.json(data);
}