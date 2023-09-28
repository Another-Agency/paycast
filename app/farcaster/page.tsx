"use client"

import Link from 'next/link';
import QRCode from 'qrcode.react';
import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    FC_APP_FID,
    NEYNAR_API_CREATE_SIGNER_URL,
    NEYNAR_API_KEY
} from './utilities/constants';
import { generateSignatureEIP712 } from './utilities/genSignature';

interface SignerData {
    signer_uuid: string;
    public_key: string;
}

interface SignatureData {
    signature: string;
    deadline: number;
}

interface RegisterData {
    signer_uuid: string;
    app_fid: number;
    deadline: number;
    signature: string;
}

export default function Farcaster() {
    const [signerUuid, setSignerUuid] = useLocalStorage('signer_uuid', '');
    const [publicKey, setPublicKey] = useLocalStorage('public_key', '');

    const [deadline, setDeadline] = useState(0);
    const [signature, setSignature] = useState('');

    const [deeplink, setDeeplink] = useState('');

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
                try {
                    const data: SignerData = await res.json();
                    console.log('Signer data returned:', data);

                    setSignerUuid(data.signer_uuid);
                    setPublicKey(data.public_key);

                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('There was a problem with the fetch operation: ' + error.message);
            }
        }
        console.log("After createSigner, deadline:", deadline);
        console.log("After createSigner, signature:", signature);

    }

    // Pass in publicKey retrieved from createSigner function through useEffect with key of public_key
    async function generateSignature(publicKey: string) {
        try {
            const { deadline, signature }: SignatureData = await generateSignatureEIP712(publicKey);
            console.log("generateSignature result:", { deadline, signature });

            setSignature(signature);
            setDeadline(deadline);
        } catch (error) {
            console.error("Error in generateSignature:", error);
            console.log("After generateSignature error, deadline:", deadline);
            console.log("After generateSignature error, signature:", signature);
        }
    }
    console.log("Render-time, deadline:", deadline);
    console.log("Render-time, signature:", signature);

    const registerSigner = async () => {

        console.log("Before fetch in registerSigner, deadline:", deadline);
        console.log("Before fetch in registerSigner, signature:", signature);

        const registerData: RegisterData = {
            signer_uuid: signerUuid,
            app_fid: FC_APP_FID,
            deadline: deadline,
            signature: signature,
        };
        console.log('Deadline before fetch:', deadline);

        try {
            const res = await fetch(`${NEYNAR_API_CREATE_SIGNER_URL}/${signerUuid}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setDeeplink(data.registerData.signer_approval_url);

        } catch (error) {
            console.error("Error in registerSigner:", error);
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


