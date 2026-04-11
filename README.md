1. App signup flow
 User enters username + password
 Generate RSA/ECC keypair in browser
 Set extractable: false
 Save public key to GunDB under username
 Store private key locally (IndexedDB only)

2. Local key storage (critical)
 Use IndexedDB (NOT localStorage)
 Store:
privateKey
key metadata (algorithm, createdAt, userId)
 Never export private key
 Never send private key to server/DB

3. Login flow
 User logs in with username + password
 Check GunDB for username → public key exists
 Load private key from IndexedDB
 If private key exists → login success
 If missing → treat as new device (no access)

4. Key verification (optional but good)
 On login, run a test challenge:
server sends random string
client signs it with private key
verify using public key

(This confirms key is valid without exposing it)

5. Messaging flow
Sending
 Fetch recipient public key from GunDB
 Encrypt message using:
RSA-OAEP (small messages) OR
Hybrid (AES-GCM + RSA) if you want better performance
 Send encrypted message + sender info
Receiving
 Load private key from IndexedDB
 Decrypt message locally only
 Never decrypt on server

6. GunDB structure (simple version)
 users/{username}/publicKey
 messages/{chatId} stores encrypted messages only
 No private data stored in GunDB

7. Security rules (non-negotiable)
 Private key never leaves device
 No key export feature
 No server-side decryption ever
 Assume DB is public / compromised
 Treat GunDB as “message relay only”

8. Session behavior
 Password only controls app access/session
 Logging out does NOT delete key
 Reinstall = loss of access (expected)

9. Failure handling

 If private key missing → show:

“This device has no registered identity. You must use original device.”

(No recovery yet — intentional)

🧭 Mental model to stick to
Username = label
Public key = identity
Private key = identity proof (device-bound)
GunDB = public routing layer only