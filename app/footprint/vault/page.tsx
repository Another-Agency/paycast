"use client"

import { useEffect, useState } from 'react';

export default function UserVault() {
    const [selectedFpId, setSelectedFpId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardExpiration, setCardExpiration] = useState('');
    const [seedPhrase, setSeedPhrase] = useState('');
    const [fetchedData, setFetchedData] = useState(null);

    // Add a hook to get the selected fp_id from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSelectedFpId(localStorage.getItem('fp_id') || '');
        }
    }, []);
    console.log('selectedFpId', selectedFpId);

    // Add a new function to vault data using the client token
    const handleVaultData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Vault data submitted');

        try {
            let response = await fetch(`/api/footprint/${selectedFpId}/client_token`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            let { token } = await response.json();
            console.log('Token fetched from server', token);

            const data = {
                "card.primary.number": cardNumber,
                "card.primary.cvc": cardCvc,
                "card.primary.expiration": cardExpiration,
                "custom.seed_phrase": seedPhrase,
            };

            const vaultResponse = await fetch(`https://api.onefootprint.com/users/vault`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-fp-authorization': token,
                },
                body: JSON.stringify(data),
            });

            if (!vaultResponse.ok) {
                // If the token is expired, generate a new one and retry
                if (vaultResponse.status === 401) {
                    console.log('Token expired, fetching a new one');
                    response = await fetch(`/api/footprint/${selectedFpId}/client_token`, {
                        method: 'GET',
                    });

                    if (!response.ok) {
                        throw new Error(await response.text());
                    }

                    ({ token } = await response.json());
                    console.log('New token fetched from server', token);

                    // Retry with the new token
                    // rest of the function...
                } else {
                    throw new Error(await vaultResponse.text());
                }
            }

            console.log('Vault response', await vaultResponse.json());
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Add a new function to fetch user data from footprint server
    const handleFetchData = async () => {
        console.log('Fetching vault from fp');

        const response = await fetch(`/api/footprint/${selectedFpId}/vault`, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error('Error:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('Data fetched from server', data);

        setFetchedData(data);
    };

    // Replace the handleSubmit function with handleVaultData in the form's onSubmit prop
    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50 text-black">
            <div className="grid grid-cols-1 bg-gray-500">
                <div className='bg-gray-300 p-2 justify-self-center self-center'>
                    <form onSubmit={handleVaultData}>
                        <label className='grid grid-rows-1'>
                            Card Number:
                            <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        </label>
                        <label className='grid grid-rows-1'>
                            Card CVC:
                            <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
                        </label>
                        <label className='grid grid-rows-1'>
                            Card Expiration:
                            <input type="text" value={cardExpiration} onChange={(e) => setCardExpiration(e.target.value)} />
                        </label>
                        <label className='grid grid-rows-1'>
                            Seed Phrase:
                            <input type="text" value={seedPhrase} onChange={(e) => setSeedPhrase(e.target.value)} />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <div className="grid grid-cols-1 bg-yellow-500">
                <div className='bg-violet-500 p-2 justify-self-center self-center'>
                    <button onClick={handleFetchData}>Fetch Data</button>
                    {fetchedData && (
                        <div className='bg-white p-2 mt-4'>
                            <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}