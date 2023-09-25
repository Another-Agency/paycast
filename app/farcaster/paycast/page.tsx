"use client"
import { useState } from "react";

export default function Paycast() {
    const [result, setResult] = useState(null);
    const [query, setQuery] = useState('');

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

    return (
        <div className="grid grid-rows-2 w-screen h-screen bg-gray-50 text-white">
            <div className="grid grid-cols-1 bg-gray-500 border-white border-2">
                <div className="grid grid-cols-1 justify-self-center self-center space-y-12">
                    <div className="grid grid-rows-1">
                        <div className="grid grid-cols-2 justify-self-center self-center space-x-12">
                            <div className="grid grid-cols-1 justify-self-center self-center">
                                From FID:
                                <input
                                    className="bg-gray-200"
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 justify-self-center self-center">
                                Send To FID:
                                <input
                                    className="bg-gray-200"
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={fetchUser}
                        className=' bg-pink-500 p-2 justify-self-center self-center'>
                        Send Funds
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 bg-violet-500 border-white border-2">
                <div className="grid grid-cols-1 justify-self-center self-center space-y-12">
                    <div className="grid grid-rows-1">
                        <div className="grid grid-cols-2 justify-self-center self-center space-x-12">
                            <div className="grid grid-cols-1 justify-self-center self-center">
                                From FID:
                                <input
                                    className="bg-gray-200"
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 justify-self-center self-center">
                                Send To FID:
                                <input
                                    className="bg-gray-200"
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={fetchUser}
                        className=' bg-pink-500 p-2 justify-self-center self-center'>
                        Request Funds
                    </button>
                </div>
            </div>
        </div>
    )
}