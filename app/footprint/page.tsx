"use client"

import '@onefootprint/footprint-js/dist/footprint-js.css';
import { FootprintVerifyButton } from '@onefootprint/footprint-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const fpPublishKey = process.env.NEXT_PUBLIC_FP_PLAYBOOK_KYB;

export default function Footprint() {
    const [validationToken, setValidationToken] = useState(null) as any;
    const [footprintId, setFootprintId] = useState(null);
    const [selectedFpId, setSelectedFpId] = useState('');
    const [userVault, setUserVault] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]) as any[] | any;

    // TODO: Replace with user sessions -> currently temp solution to keep track of fp_id
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSelectedFpId(localStorage.getItem('fp_id') || '');
        }
    }, []);

    // Get the validation token from Footprint (needed to get the user fp_id)
    useEffect(() => {
        console.log("validationToken", validationToken);

        if (validationToken) {
            fetch('/api/footprint/onboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: validationToken,
                }),
            })
                .then(onboardResponse => onboardResponse.json())
                .then(fpUserData => setFootprintId(fpUserData));
        }
    }, [validationToken]);

    useEffect(() => {
        fetch('/api/footprint/onboard')
            .then(response => response.json())
            .then(data => setFootprintId(data.fp_ids))
            .catch(error => console.error('Error:', error));
    }, []);

    // Admin Hack to get the list of fp_ids from our DB (not needed for production / replaced by sessions)
    useEffect(() => {
        fetch('/api/footprint')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('fp_id_select');
                if (select) {
                    data.fp_ids.forEach((fp_id: string) => {
                        const option = document.createElement('option');
                        option.value = fp_id;
                        option.text = fp_id;
                        select.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleFpIdChange = (event: { target: { value: any; }; }) => {
        const fpId = event.target.value;
        setSelectedFpId(fpId);

        localStorage.setItem('fp_id', fpId);
    };

    // Get the user fp_id from the Footprint server
    const handleRetrieveFields = () => {
        console.log("selectedFpId", selectedFpId);

        fetch(`/api/footprint/${selectedFpId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: footprintId,
                fields: selectedFields,
            }),
        })
            .then(response => response.json())
            .then(data => setUserVault(data))
            .catch(error => console.error('Error:', error));
        console.log("footprintID", footprintId);
    };

    // Get the selected fields for the user from footprint server
    const handleFieldChange = (event: { target: { selectedOptions: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
        setSelectedFields(Array.from(event.target.selectedOptions, (option: any) => (option as HTMLOptionElement).value));
    };

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50">
            <div className="grid grid-cols-1 bg-gray-500">
                <div className='bg-pink-500 grid-rows-1 p-2 justify-self-center self-center'>
                    <FootprintVerifyButton
                        publicKey={fpPublishKey}
                        dialogVariant='modal'
                        onComplete={(valToken) => {
                            console.log("on completed", valToken);
                            setValidationToken(valToken);
                        }}
                        onCancel={() => {
                            console.log("user canceled!");
                        }}
                    />
                </div>
                <Link href={'/footprint/vault'} className='bg-pink-500 grid-rows-1 p-2 justify-self-center self-center'>
                    Vault
                </Link>
            </div>
            <div className="grid grid-cols-1 bg-yellow-500">
                <div className='bg-violet-500 p-2 justify-self-center self-center'>
                    Retrieve Footprint User
                    <select id="fp_id_select" value={selectedFpId} onChange={handleFpIdChange}>
                        <option value="">Select fp_id</option>
                        {/* Options will be populated by the useEffect hook */}
                    </select>
                    <select multiple={true} value={selectedFields} onChange={handleFieldChange}>
                        <option value="id.first_name">First Name</option>
                        <option value="id.last_name">Last Name</option>
                        <option value="id.dob">Date of Birth</option>
                        {/* Add more options as needed */}
                    </select>
                    <button onClick={handleRetrieveFields}>Submit</button>
                    {userVault && <pre>{JSON.stringify(userVault, null, 2)}</pre>}
                </div>
            </div>
        </div>
    )
}

