import { NextRequest, NextResponse } from "next/server";

const FP_API_KEY = process.env.NEXT_PUBLIC_FP_API_KEY || '';

// Get a short lived token for client-side vault access
export async function GET(req: NextRequest) {
    const fp_id = req.nextUrl.pathname.split('/')[3];
    console.log('fp_id:', fp_id);

    try {
        const response = await fetch(`https://api.onefootprint.com/users/${fp_id}/client_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Footprint-Secret-Key': FP_API_KEY,
            },
            body: JSON.stringify({
                fields: [
                    "card.primary.number",
                    "card.primary.cvc",
                    "card.primary.expiration",
                    "custom.seed_phrase",
                ],
                scopes: ["vault"],
                ttl: 180,
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.log('Status:', response.status);
            const errorBody = await response.json();
            console.log('Error:', errorBody);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Token Gotten', data.token);
        return NextResponse.json({ token: data.token });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An error occurred while processing the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}