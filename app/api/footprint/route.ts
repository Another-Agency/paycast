import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const FP_API_KEY = process.env.NEXT_PUBLIC_FP_API_KEY || '';

// Admin Utility Function ONLY -> GET all the fp_ids from our DB
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.footprintUser.findMany({
      select: {
        fp_id: true
      },
    });

    const fp_ids = users.map((user: { fp_id: string | null }) => user.fp_id || '');

    return NextResponse.json({ fp_ids });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred while processing the request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// TODO: Setup custom onboard button api calls here



