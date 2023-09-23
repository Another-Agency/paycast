import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const FC_APP_FID = process.env.NEXT_PUBLIC_FC_APP_FID || '';

export async function POST(req: NextRequest) {
    const signerUuid = req.nextUrl.pathname.split('/')[3];
    if (!req.body) {
        return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
    }
    const signedKey = req.body.signerUuid;
    if (!signedKey) {
        return NextResponse.json({ error: 'Request body is missing the signed_key field' }, { status: 400 });
    }
    const res = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
        },
        data: {
            signerUuid: signerUuid,
            appFid: 
        }
        body: JSON.stringify({ signed_key: signedKey }),
    });

    const data = await res.json();
    return NextResponse.json(data);
}