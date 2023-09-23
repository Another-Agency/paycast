import { NextRequest, NextResponse } from "next/server";

const FP_API_KEY = process.env.NEXT_PUBLIC_FP_API_KEY || '';


// Decrypt user data from vault
export async function GET(req: NextRequest) {
    const fp_id = req.nextUrl.pathname.split('/')[3]; // Extract fp_id from the URL

    try {
        const response = await fetch(`https://api.onefootprint.com/users/${fp_id}/vault/decrypt`, {
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
                reason: "Retrieving user data",
            }),
        });

        if (!response.ok) {
            console.log('Status:', response.status);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('GET Data from Vault', data);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An error occurred while processing the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}