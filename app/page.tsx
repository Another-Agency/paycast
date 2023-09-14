"use client"

import '@onefootprint/footprint-js/dist/footprint-js.css';
import { FootprintVerifyButton } from '@onefootprint/footprint-react';
import { useState } from 'react';

const fpPublishKey = process.env.NEXT_PUBLIC_FP_PLAYBOOK_KYB;
const fpAuthToken = process.env.NEXT_PUBLIC_FP_API_KEY || '';

export default function Home() {
  const [validationToken, setValidationToken] = useState(null) as any;

  return (
    <div className="grid grid-cols-2 w-screen h-screen bg-gray-50">
      <div className="grid grid-cols-1 bg-gray-500">
        <div className='bg-pink-500 p-2 justify-self-center self-center'>
          <FootprintVerifyButton
            publicKey={fpPublishKey}
            dialogVariant='modal'
            onComplete={(token) => {
              console.log("on completed", token);
              setValidationToken(token);
            }}
            onCancel={() => {
              console.log("user canceled!");
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 bg-yellow-500">
        <div className='bg-violet-500 p-2 justify-self-center self-center'>
          Retrieve Footprint User
          {/* <button onClick={retrieveUserData}>Retrieve User Data</button> */}
        </div>
      </div>
    </div>
  )
}

