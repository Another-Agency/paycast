import { NextRequest, NextResponse } from "next/server";

const FP_API_KEY = process.env.NEXT_PUBLIC_FP_API_KEY || '';

// Retrieve user data from the FP API
export async function POST(req: NextRequest & { body: { token: any; }; }) {
    const reader = req.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder('utf-8');
    const body = JSON.parse(decoder.decode(result.value));

    const fp_id = req.nextUrl.pathname.split('/')[3]; // Extract fp_id from the URL

    console.log('fp_id:', fp_id);
    console.log('FP_API_KEY:', FP_API_KEY);
    console.log('fields:', body.fields);
    console.log('reason:', body.reason);

    try {
        const response = await fetch(`https://api.onefootprint.com/users/${fp_id}/vault/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Footprint-Secret-Key': FP_API_KEY,
            },
            body: JSON.stringify({
                fields: body.fields,
                reason: "This is a test",
            }),
        });

        if (!response.ok) {
            console.log('Status:', response.status);
            const errorBody = await response.json();
            console.log('Error:', errorBody);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('data', data);

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An error occurred while processing the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

