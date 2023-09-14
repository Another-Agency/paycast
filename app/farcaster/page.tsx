"use client"

import { useState } from 'react';
import { mnemonicToAccount } from "viem/accounts";

const public_key = process.env.NEXT_PUBLIC_FC_ADDRESS || '';
const app_fid = process.env.NEXT_PUBLIC_FC_APP_FID || '';
const account_mnemonic = process.env.NEXT_PUBLIC_FC_ACCOUNT_MNEMONIC || '';

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

export default function SearchUser() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [signerUuid, setSignerUuid] = useState('');
    const [signedKey, setSignedKey] = useState('');


    async function generate_signature() {
        const account = mnemonicToAccount(account_mnemonic);
        const deadline = Math.floor(Date.now() / 1000) + 86400;

        const signature = await account.signTypedData({
            domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
            types: {
                SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
            },
            primaryType: "SignedKeyRequest",
            message: {
                requestFid: BigInt(app_fid),
                key: public_key,
                deadline: BigInt(deadline),
            },
        });

        console.log("deadline: ", deadline);
        console.log("Signature: ", signature);
    }

    const fetchUser = async () => {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
        const url = new URL('https://api.neynar.com/v2/farcaster/user/search');
        url.searchParams.append('viewer_fid', '2455');
        url.searchParams.append('q', query);
        url.searchParams.append('api_key', apiKey);

        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await res.json();
        setResult(data);
    };

    const createSigner = async () => {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
        const url = new URL('https://api.neynar.com/v2/farcaster/signer');

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'api_key': apiKey,
            },
        });

        const data = await res.json();
        setSignerUuid(data.uuid);
    };

    const registerSigner = async (signerUuid: any, signedKey: any) => {
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
        const url = new URL(`https://api.neynar.com/v2/farcaster/signer/${signerUuid}/signed_key`);

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'api_key': apiKey,
            },
            body: JSON.stringify({ signed_key: signedKey }),
        });

        const data = await res.json();
        setSignedKey(data.signed_key);
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl mb-4">Search User</h1>
            <form onSubmit={(e) => { e.preventDefault(); fetchUser(); }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-2 border-gray-300 rounded p-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 ml-2 rounded">Search</button>
            </form>
            <button onClick={generate_signature} className="bg-purple-500 text-white p-2 ml-2 rounded">Generate Signature</button>
            <button onClick={createSigner} className="bg-green-500 text-white p-2 ml-2 rounded">Create Signer</button>
            <button onClick={() => registerSigner(signerUuid, signedKey)} className="bg-red-500 text-white p-2 ml-2 rounded">Register Signer</button>
            <div className="mt-4">
                {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
                {signerUuid && <p>Signer UUID: {signerUuid}</p>}
                {signedKey && <p>Signed Key: {signedKey}</p>}
            </div>
        </div>
    );
}
