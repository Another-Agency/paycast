Signer
A signer object contains the following fields:

signer_uuid

This uuid is generated on v2/farcaster/signer POST request and used across all other Neynar APIs. Once generated, we recommend mapping it to the user object within your app and storing it.

status - generated | pending_approval | approved | revoked

Represents the different states of a signer. We recommend storing this within your app to have users resume onboarding if they left mid-step.

public_key
This is the public key corresponding to the private key of the signers. It is a hex string format.

fid
This represents the user’s fid.

approval_url
This is the deeplink url into Warpcast mobile app.


1 - App creates a signer using the Neynar API - POST /v2/farcaster/signer and gets the signer public key. App maps the signer uuid to their internal user object
This request creates a signer. Here’s a brief overview of what the signer’s state looks like after this initial request:

signer_uuid - Returns an identifier for the signer
status - Should be generated after this POST
public_key - Returns the public key of this Neynar-managed signer.
fid - At this stage it should be null
approval_url - At this stage it should be null

2 - App creates a signature using the app’s fid, deadline and the signer public key (Example app to generate signature)
Apps requesting a user’s signer need to be verified by hubs and registered onchain. In order to do that, App’s have to sign a message to prove they are who they say they are. The signature should contain:

app’s fid - if you don’t have a farcaster account for your app, we recommend you create one.
deadline - indicates when the signature should no longer be valid. unix timestamp in seconds
public key - in order to create the chain of trust from the user to the signer managed by Neynar, we need to include the public key of the signer in the signature as well. This should be the same as provided in the response by the Neynar API in Step 1.
There will be easier ways to create this in the future via Farcaster libraries but for now see this example gist on how to create the data object and sign it: https://gist.github.com/manan19/367a34980e12b9de13ab4afafb3d05d2.

In order to sign it, you’ll need to use the mnemonic seed phrase of your Farcaster custody address. The generated signature will be of the format:

JavaScript

0xe5d95c391e165dac8efea373efe301d3ea823e1f41713f8943713cbe2850566672e33ff3e17e19abb89703f650a2597f62b4fda0ce28ca15d59eb6d4e971ee531b

3 - App registers the signed key with the Neynar API - POST /v2/farcaster/signer/signed_key and gets an approval url
Once the signature along with other detail are registered using this API, the signer state should look like the following:
1. signer_uuid - Unchanged. Same identifier for the signer
2. status - Changes to pending_approval after a successful POST request
3. public_key - Unchanged.
4. fid - Unchanged. At this stage it should be null
5. approval_url - Changes to deeplink url with the format like "farcaster://signed-key-request?token=0x54f0c31af79ce01e57568f3b".


4 - App presents the user with the approval url and begins polling the GET /v2/farcaster/signer API using the signer_uuid
The app can present the approval url if it’s on mobile or a QR code for web. Once presented to the user, the App can start polling to fetch the status of the signer. The response for the polling API should include the pending_approval status and the same information as the response in Step 3.


5 - User opens the link and completes the Onchain Signer Add Request flow in Warpcast mobile app
The user now needs to accept or decline interacting with the approval url. If they chose to follow the deeplink or scan the QR, they should be routed to the Warpcast app on mobile to the following screen.


When the user slides to connect to the app, Warpcast will initiate an onchain transaction to register the signer for the logged in user. Once confirmed, the user will have to manually navigate back to your App.


6 - App finds the user’s fid in the polling response
If your App was polling while the onchain transaction was getting confirmed, then you should receive a change in the signer status:

signer_uuid - Unchanged. Same identifier for the signer
status - Changes to “approved”
public_key - Unchanged.
fid - Changes to an integer that represents the user’s farcaster id
approval_url - Unchanged
Once approved, update the state of the signer within your App and read the fid to start displaying the user’s relevant content.


7 - App uses signer_uuid for all Neynar Farcaster Writes APIs on behalf of that user
The signer_uuid can now be used to write on behalf of a specific user on Farcaster. You’ll need a unique signer for each of your user. The signer_uuid generated using a developer account are not shared or cannot be used by another developer.


# Create Signer
```
import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://api.neynar.com/v2/farcaster/signer',
  headers: {accept: 'application/json', api_key: 'NEYNAR_API_DOCS'}
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

```

# Register Signed Key
```
import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://api.neynar.com/v2/farcaster/signer/signed_key',
  params: {
    api_key: 'NEYNAR_API_DOCS',
    signer_uuid: '400bf72d-f1e3-406b-9ad1-819d99d8c5d3'
  },
  headers: {accept: 'application/json', api_key: 'NEYNAR_API_DOCS'}
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

```

# Get Signer


```
import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://api.neynar.com/v2/farcaster/signer',
  params: {
    signer_uuid: '400bf72d-f1e3-406b-9ad1-819d99d8c5d3',
    api_key: 'NEYNAR_API_DOCS'
  },
  headers: {accept: 'application/json'}
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

```
# Write on behalf of a user