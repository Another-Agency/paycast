import Link from 'next/link'

export default function Siwe() {

    return (
        <div className="grid grid-cols-2 w-screen h-screen bg-gray-50">
            <div className="grid grid-cols-1 bg-red-500">
                <Link
                    href={'/footprint'}
                    className='bg-white p-2 justify-self-center self-center'>
                    createSiweMessage
                </Link>
            </div>
            <div className="grid grid-cols-1 bg-gray-500">
                <Link
                    href={'/farcaster'}
                    className='bg-white p-2 justify-self-center self-center'>
                    connectWallet
                </Link>
            </div>
            <div className="grid grid-cols-1 bg-gray-500">
                <Link
                    href={'/siwe'}
                    className='bg-white p-2 justify-self-center self-center'>
                    SIWE
                </Link>
            </div>
            <div className="grid grid-cols-1 bg-red-500">
                <Link
                    href={'/pylon'}
                    className='bg-white p-2 justify-self-center self-center'>
                    -
                </Link>
            </div>

        </div>
    )
}