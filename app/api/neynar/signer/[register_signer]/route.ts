import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const FC_APP_FID = process.env.NEXT_PUBLIC_FC_APP_FID || '';

export async function POST(req: NextRequest) {
    console.log("POST request received for signer registration");
    const signerUuid = req.nextUrl.pathname.split('/')[3];
    console.log(`Signer UUID: ${signerUuid}`);
    if (!req.body) {
        console.log("Error: Request body is missing");
        return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
    }
    const body = await new Response(req.body).json();
    const signedKey = body.signed_key;
    if (!signedKey) {
        console.log("Error: Request body is missing the signed_key field");
        return NextResponse.json({ error: 'Request body is missing the signed_key field' }, { status: 400 });
    }
    console.log("Sending request to Neynar API");
    const res = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
        },
        body: JSON.stringify({
            signer_uuid: signerUuid,
            app_fid: FC_APP_FID,
            deadline: body.deadline,
            signature: signedKey,
        }),
    });

    if (!res.ok) {
        console.log(`HTTP error! status: ${res.status}`);
        return NextResponse.json({ error: `HTTP error! status: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    console.log("Response received from Neynar API");
    return NextResponse.json(data);
}