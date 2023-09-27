"use client"

import Link from 'next/link';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const FC_APP_FID = process.env.NEXT_PUBLIC_FID ? Number(process.env.NEXT_PUBLIC_FID) : 0;

export default function Farcaster() {
    const [signerUuid, setSignerUuid] = useState('');
    const [signature, setSignature] = useState('');
    const [deadline, setDeadline] = useState(0); // Unix timestamp
    const [deeplink, setDeeplink] = useState('');
    const [publicKey, setPublicKey] = useState('');

    // Create signer first to get UUID and public key //
    // UUID is returned from the createSigner function and used to register the signer
    useEffect(() => {
        const storedSignerUuid = localStorage.getItem('signer_uuid');
        if (storedSignerUuid) {
            setSignerUuid(storedSignerUuid);
        }
    }, [signerUuid]);

    // Public key is returned from the createSigner function and passed to the generateSignature function
    useEffect(() => {
        const storedPublicKey = localStorage.getItem('public_key');
        if (storedPublicKey) {
            setPublicKey(storedPublicKey);
        }
        console.log('UE publicKey:', publicKey);
    }, [publicKey]);

    // Signature is returned from the generateSignature function
    useEffect(() => {
        const storedSignature = localStorage.getItem('signature');
        if (storedSignature) {
            setSignature(storedSignature);
        }
        console.log('UE signature:', signature);
    }, [signature]);

    // Deadline is returned from the generateSignature function
    useEffect(() => {
        const storedDeadline = localStorage.getItem('deadline');
        if (storedDeadline) {
            console.log('Stored deadline:', storedDeadline);
            const deadlineNumber = Number(storedDeadline);
            console.log('Converted deadline:', deadlineNumber);
            setDeadline(deadlineNumber);
        }
    }, [deadline]);


    const createSigner = async () => {
        try {
            const res = await fetch('/api/neynar/signer', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'api_key': NEYNAR_API_KEY,
                },
            });

            console.log('Headers:', {
                'Accept': 'application/json',
                'api_key': NEYNAR_API_KEY,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
                const data = await res.json();
                console.log('Signer data returned:', data);

                setSignerUuid(data.signer_uuid);
                setPublicKey(data.public_key);

                // use these keys in useEffect to retrieve the values
                localStorage.setItem('signer_uuid', data.signer_uuid);
                localStorage.setItem('public_key', data.public_key);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('There was a problem with the fetch operation: ' + error.message);
            }
        };
    }

    // Pass in publicKey retrieved from createSigner function through useEffect with key of public_key
    async function generateSignature(publicKey: string) {

        const res = await fetch('/api/neynar/gen_signature', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'public-key': publicKey,
            },
        });
        if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
        } else {
            try {
                const data = await res.json();

                setSignature(data.signature);
                setDeadline(data.deadline);

                localStorage.setItem('signature', data.signature);
                localStorage.setItem('deadline', String(data.deadline));

                console.log('genSig fn Signature data:', data);
                console.log('genSig fn Signature:', data.signature);
                console.log('genSig fn Deadline:', data.deadline);

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }

    const registerSigner = async () => {
        console.log('Deadline before fetch:', deadline);

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

            setDeeplink(data.registerData.signer_approval_url);
        }
    };

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50 text-white">
            <div className="grid grid-cols-1 bg-gray-500">
                <button
                    onClick={createSigner}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Create Signer
                </button>
            </div>
            <div className="grid grid-cols-1 bg-violet-500">
                <button
                    onClick={() => generateSignature(publicKey)}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Generate Signature
                </button>
            </div>
            <div className="grid grid-rows-1 bg-violet-500">
                <button
                    onClick={registerSigner}
                    className='bg-pink-500 p-2 justify-self-center self-center'>
                    Register Signer
                </button>
                {deeplink && (
                    <div className='justify-self-center self-center mb-8'>
                        <QRCode value={deeplink} />
                    </div>
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


