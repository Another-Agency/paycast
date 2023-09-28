import { NEYNAR_API_KEY } from "@/app/farcaster/utilities/constants";
import { generateSignatureEIP712 } from "@/app/farcaster/utilities/genSignature";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestBodySchema = z.object({
    app_fid: z.number(),
    signer_uuid: z.string(),
});

const RequestHeadersSchema = z.object({
    accept: z.string().optional().refine(value => value?.includes('application/json'), {
        message: 'Accept header must include application/json',
    }),
    public_key: z.string(),
});

export async function POST(req: NextRequest) {

    const headersObj = Object.fromEntries(req.headers);
    const parsedHeaders = RequestHeadersSchema.safeParse(headersObj);

    if (!parsedHeaders.success) {
        console.error("Invalid headers", parsedHeaders.error);
        return NextResponse.json({ error: "Invalid headers" }, { status: 400 });
    }

    // Retrieve and validate the public key from the headers
    const publicKey = parsedHeaders.data.public_key;
    if (!publicKey) {
        return NextResponse.json({ error: "Public key is missing from headers" }, { status: 400 });
    }

    try {
        const body = await new Response(req.body).json();

        // Validate the request body
        const parsedBody = RequestBodySchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ error: parsedBody.error.message }, { status: 400 });
        }

        const signerUuid = body.signer_uuid;
        if (!signerUuid) {
            return NextResponse.json({ error: 'Request body is missing the signer_uuid field' }, { status: 400 });
        }

        const app_fid = body.app_fid;
        if (!app_fid || typeof app_fid !== 'number') {
            return NextResponse.json({ error: 'Request body is missing the app_fid field or it is not a number' }, { status: 400 });
        }

        // Pass the validated publicKey to the generateSignatureEIP712 function
        const { deadline, signature } = await generateSignatureEIP712(publicKey);

        const registerRes = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api_key': NEYNAR_API_KEY,
            },
            body: JSON.stringify({
                signer_uuid: signerUuid,
                app_fid: app_fid,
                deadline: deadline,
                signature: signature,
            }),
        });

        if (!registerRes.ok) {
            // ... existing error handling code ...
        } else {
            const registerData = await registerRes.json();

            // Return the registration data immediately
            return NextResponse.json({ registerData });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message || 'An error occurred while processing the request.' }, { status: 500 });
    }
}