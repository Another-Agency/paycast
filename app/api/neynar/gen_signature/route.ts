import { NextRequest, NextResponse } from "next/server";
import { mnemonicToAccount } from "viem/accounts";

//const FC_ADDRESS = process.env.NEXT_PUBLIC_FC_ADDRESS || '';
const FC_APP_FID = process.env.NEXT_PUBLIC_FID || '';
const FC_ACCOUNT_MNEMONIC = process.env.NEXT_PUBLIC_FC_MNEMONIC || '';

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
    name: "Farcaster SignedKeyRequestValidator",
    version: "1",
    chainId: 10,
    verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
};
const SIGNED_KEY_REQUEST_TYPE = [
    { name: "requestFid", type: "uint256" },
    { name: "key", type: "bytes" },
    { name: "deadline", type: "uint256" },
];

export async function GET(req: NextRequest) {
    try {
        const account = mnemonicToAccount(FC_ACCOUNT_MNEMONIC);

        const publicKey = await req.headers.get('public-key') || '';
        console.log('publicKey in route:', publicKey);

        const deadline = Math.floor(Date.now() / 1000) + 86400;

        if (!publicKey) {
            console.error('Invalid public key');
            return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
        }

        const signature = await account.signTypedData({
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(FC_APP_FID),
                key: publicKey,
                deadline: BigInt(deadline),
            },
        });

        console.log('Data to sign:', {
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(FC_APP_FID),
                key: publicKey,
                deadline: BigInt(deadline),
            },
        });

        console.log('Generated Signature:', signature);
        console.log('Generated Deadline:', deadline);

        return NextResponse.json({ deadline, signature });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error generating signature', error.message);
        } else {
            console.error('An unexpected error occurred');
        }
        return NextResponse.error();
    }
}