"use client"

import '@onefootprint/footprint-js/dist/footprint-js.css';
import Link from 'next/link';

const fpPublishKey = process.env.NEXT_PUBLIC_FP_PLAYBOOK_KYB;

export default function Home() {

  return (
    <div className="grid grid-cols-2 w-screen h-screen bg-gray-50">
      <div className="grid grid-cols-1 bg-gray-500">
        <Link
          href={'/footprint'}
          className='bg-pink-500 p-2 justify-self-center self-center'>
          Footprint
        </Link>
      </div>
      <div className="grid grid-cols-1 bg-yellow-500">
        <Link
          href={'/farcaster'}
          className='bg-pink-500 p-2 justify-self-center self-center'>
          Farcaster
        </Link>
      </div>
      <div className="grid grid-cols-1 bg-yellow-500">
        <Link
          href={'/siwe'}
          className='bg-pink-500 p-2 justify-self-center self-center'>
          SIWE
        </Link>
      </div>
      <div className="grid grid-cols-1 bg-gray-500">
        <Link
          href={'/pylon'}
          className='bg-pink-500 p-2 justify-self-center self-center'>
          Pylon
        </Link>
      </div>

    </div>
  )
}

