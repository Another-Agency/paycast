import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

const ResponseBodySchema = z.object({
    signer_uuid: z.string(),
    public_key: z.string(),
    status: z.string(),
    signer_approval_url: z.string().optional(),
});

const RequestHeadersSchema = z.object({
    accept: z.string().optional().refine(value => value?.includes('application/json'), {
        message: 'Accept header must include application/json',
    }),
    api_key: z.string().optional(),
});


export async function POST(req: NextRequest) {

    const headersObj = Object.fromEntries(req.headers);
    const parsedHeaders = RequestHeadersSchema.safeParse(headersObj);

    if (!parsedHeaders.success) {
        console.error("Invalid headers", parsedHeaders.error);
        return NextResponse.json({ error: "Invalid headers" }, { status: 400 });
    }

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

    const responseData = await response.json();
    const plainResponseData = JSON.parse(JSON.stringify(responseData));
    const parsedResponse = ResponseBodySchema.safeParse(plainResponseData);

    if (!parsedResponse.success) {
        console.error("Invalid response data", parsedResponse.error);
        return NextResponse.json({ error: "Invalid response data" }, { status: 400 });
    }

    return NextResponse.json(parsedResponse.data);
}