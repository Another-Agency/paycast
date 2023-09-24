"use client"

import { useEffect, useState } from 'react';

const FC_APP_FID = process.env.NEXT_PUBLIC_FID || 'nope';

export default function Farcaster() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [signerUuid, setSignerUuid] = useState('');
    const [signedKey, setSignedKey] = useState('');

    useEffect(() => {
        const storedSignature = localStorage.getItem('signature');
        if (storedSignature) {
            setSignedKey(storedSignature);
        }
    }, []);

    useEffect(() => {
        console.log('Signer UUID:', signerUuid);
    }, [signerUuid]);

    useEffect(() => {
        const storedSignerUuid = localStorage.getItem('signer_uuid');
        if (storedSignerUuid) {
            setSignerUuid(storedSignerUuid);
        }
    }, []);

    // Generate ECDSA signature for registering a signed key
    async function generate_signature() {
        const res = await fetch('/api/neynar/gen_signature', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
        } else {
            try {
                const data = await res.json();
                setSignedKey(data.signature);
                localStorage.setItem('signature', data.signature);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
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
        try {
            const res = await fetch('/api/neynar/signer', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
                const data = await res.json();
                console.log('Signer data:', data);
                setSignerUuid(data.signer_uuid);
                localStorage.setItem('signer_uuid', data.signer_uuid);
                console.log('Signer UUID:', data.signer_uuid);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('There was a problem with the fetch operation: ' + error.message);
            }
        };
    }

    const registerSigner = async () => {
        const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // current Unix timestamp + 24 hours
        const res = await fetch(`/api/neynar/signer/${signerUuid}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                signer_uuid: signerUuid,
                app_fid: FC_APP_FID,
                deadline: deadline,
                signed_key: signedKey,
            }),
        });

        if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
        } else {
            const data = await res.json();
            console.log('Registered signer data:', data);
        }
    };

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50 text-white">
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
            <div className="grid grid-rows-1 bg-violet-500">
                <button
                    onClick={registerSigner}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Register Signer
                </button>
            </div>
            <div className="grid grid-rows-1 bg-gray-500">
                <div className='grid grid-cols-1 justify-self-center self-center'>
                    <button
                        //onClick={fetchUser}
                        className='bg-pink-500 p-2 m-1'>
                        Send Funds
                    </button>
                    <button
                        //onClick={fetchUser}
                        className='bg-pink-500 p-2 m-1'>
                        Request Funds
                    </button>
                </div>
            </div>
        </div>
    )
}

