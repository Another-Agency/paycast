"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';

const FC_APP_FID = process.env.NEXT_PUBLIC_FID ? Number(process.env.NEXT_PUBLIC_FID) : 0;

export default function Farcaster() {
    const [signerUuid, setSignerUuid] = useState('');
    const [signature, setSignature] = useState('');
    const [deeplink, setDeeplink] = useState('');

    useEffect(() => {
        const storedSignature = localStorage.getItem('signature');
        if (storedSignature) {
            setSignature(storedSignature);
        }
    }, []);

    useEffect(() => {
        const storedSignerUuid = localStorage.getItem('signer_uuid');
        if (storedSignerUuid) {
            setSignerUuid(storedSignerUuid);
            console.log('Stored UE Signer UUID:', storedSignerUuid);
        }
    }, [signerUuid]);

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
                setSignature(data.signature);
                localStorage.setItem('signature', data.signature);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }

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
                console.log('Create Signer UUID:', data.signer_uuid);
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
                signature: signature,
            }),
        });

        if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
        } else {
            const data = await res.json();
            console.log('Registered signer data:', data);
            console.log('Registered signer UUID:', data.getData.signer_uuid);
            setDeeplink(data.getData.signer_approval_url);
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
                {deeplink && (
                    <a href={deeplink} className='bg-pink-500 p-2 justify-self-center self-center'>
                        Open Deeplink
                    </a>
                )}
            </div>
            <div className="grid grid-rows-1 bg-gray-500">
                <Link href="/farcaster/paycast"
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Paycast
                </Link>

            </div>
        </div>
    )
}

