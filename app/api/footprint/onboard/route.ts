import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const FP_API_KEY = process.env.NEXT_PUBLIC_FP_API_KEY || '';

// Use the validation token we got on the frontend to request the fp_id from the FP API
export async function POST(req: NextRequest & { body: { token: any; }; }) {
    const reader = req.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder('utf-8');
    const body = JSON.parse(decoder.decode(result.value));

    try {
        const response = await fetch('https://api.onefootprint.com/onboarding/session/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Footprint-Secret-Key': FP_API_KEY,
            },
            body: JSON.stringify({
                validation_token: body.token,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Create a new user with the fp_id in our DB
        const user = await prisma.footprintUser.create({
            data: {
                fp_id: data.user.fp_id
            },
        });

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'An error occurred while processing the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}




