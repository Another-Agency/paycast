

export const NEYNAR_API_CREATE_SIGNER_URL = 'https://api.neynar.com/v2/farcaster/signer';
export const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
export const FC_APP_FID = process.env.NEXT_PUBLIC_FID ? Number(process.env.NEXT_PUBLIC_FID) : 0;

// Generate Signature Constants
export const FC_ACCOUNT_MNEMONIC = process.env.NEXT_PUBLIC_FC_MNEMONIC || '';
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
    name: "Farcaster SignedKeyRequestValidator",
    version: "1",
    chainId: 10,
    verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
};
export const SIGNED_KEY_REQUEST_TYPE = [
    { name: "requestFid", type: "uint256" },
    { name: "key", type: "bytes" },
    { name: "deadline", type: "uint256" },
];
