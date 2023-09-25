import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

export async function POST(req: NextRequest) {
    try {

        const body = await new Response(req.body).json();
        console.log('body in route:', body);
        if (!req.body) {
            return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
        }

        const signerUuid = body.signer_uuid;
        console.log('signerUuid in route:', signerUuid);
        if (!signerUuid) {
            return NextResponse.json({ error: 'Request body is missing the signer_uuid field' }, { status: 400 });
        }

        const app_fid = body.app_fid;
        console.log('app_fid in route:', app_fid);
        if (!app_fid || typeof app_fid !== 'number') {
            return NextResponse.json({ error: 'Request body is missing the app_fid field or it is not a number' }, { status: 400 });
        }

        const signature = body.signature;
        console.log('signature in route:', signature);
        if (!signature) {
            return NextResponse.json({ error: 'Request body is missing the signed_key field' }, { status: 400 });
        }

        const deadline = body.deadline;
        console.log('deadline in route:', deadline);
        if (!deadline || typeof deadline !== 'number') {
            return NextResponse.json({ error: 'Request body is missing the deadline field or it is not a number' }, { status: 400 });
        }

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
            const errorBody = await registerRes.text();
            console.error(`HTTP error! status: ${registerRes.status}, body: ${errorBody}`);
            throw new Error(`HTTP error! status: ${registerRes.status}`);
        } else {
            const registerData = await registerRes.json();
            console.log('Registered signer data:', registerData);

            // Start polling the GET signer API
            let attempts = 0;
            const maxAttempts = 3; // Maximum number of polling attempts
            const delay = 5000; // Delay between each polling attempt in milliseconds

            while (attempts < maxAttempts) {
                attempts++;

                const getRes = await fetch(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${signerUuid}`, {
                    method: 'GET',
                    headers: {
                        'api_key': NEYNAR_API_KEY,
                    },
                });

                if (!getRes.ok) {
                    console.error(`HTTP error! status: ${getRes.status}`);
                } else {
                    const getData = await getRes.json();
                    console.log('Signer data:', getData);

                    // Check if the expected data is received
                    if (getData.deeplink) {
                        // Return both the registration and retrieval data
                        return NextResponse.json({ registerData, getData });
                    }
                }
                console.log(`Attempt ${attempts} of ${maxAttempts} failed. Retrying in ${delay} milliseconds...`);

                // Wait before the next polling attempt
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // If the polling didn't succeed after maxAttempts, return an error
            return NextResponse.json({ error: 'Failed to retrieve the signer data after multiple attempts.' }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message || 'An error occurred while processing the request.' }, { status: 500 });
    }
}