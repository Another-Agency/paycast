"use client"

import { useState } from 'react';

export default function SearchUser() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [signerUuid, setSignerUuid] = useState('');
    const [signedKey, setSignedKey] = useState('');

    async function generate_signature() {
        const res = await fetch('/api/neynar/gen_signature', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await res.json();
        console.log("Signature: ", data.signature);
    }

    const fetchUser = async () => {
        const res = await fetch(`/api/neynar/search_user?q=${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await res.json();
        setResult(data);
    };

    const createSigner = async () => {
        const res = await fetch('/api/farcaster/signer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await res.json();
        setSignerUuid(data.uuid);
    };

    const registerSigner = async (signerUuid: any, signedKey: any) => {
        const res = await fetch(`/api/farcaster/signer/${signerUuid}/signed_key`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({ signed_key: signedKey }),
        });

        const data = await res.json();
        setSignedKey(data.signed_key);
    };

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50">
            <div className="grid grid-cols-1 bg-gray-500">
                <button
                    onClick={generate_signature}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Generate Signature
                </button>
            </div>
            <div className="grid grid-cols-1 bg-violet-500">
                <button
                    onClick={createSigner}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Create Signer
                </button>
            </div>
        </div>
    )
}
