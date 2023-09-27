import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

const ResponseBodySchema = z.object({
    signer_uuid: z.string(),
    public_key: z.string(),
    status: z.string(),
    signer_approval_url: z.string(),
});

export async function POST(req: NextRequest) {
    const response = await fetch('https://api.neynar.com/v2/farcaster/signer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
        },
    });

    if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        return NextResponse.json({ error: 'Request failed' }, { status: response.status });
    }

    const data = await response.json();
    const parsedData = ResponseBodySchema.safeParse(data);

    if (!parsedData.success) {
        return NextResponse.json({ error: parsedData.error.message }, { status: 400 });
    }

    console.log('Neynar create signer data:', parsedData.data);

    return NextResponse.json(parsedData.data);
}