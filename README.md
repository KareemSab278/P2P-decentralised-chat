WIP: 
---
okay so i was doing some research and found out this thing that crypto systems do: keypairs

so the way it works is each user in the chat session will generate a keypair like {public_key: xxxx, private_key: xxxx}

no user can see the private key - just the public key. they share the public key between one another (how idk yet. will have to find a way)

the public key gets sent with every message and essentially "protects" the messages from falling into the wrong hands or being copied by hackers

then then the recepient receives the message with the public key then the data is decrypted by the private key that is stored on the user's device.

I also want to keep the "mutually agreed decryption-encryption keypair" between users for the duration of the chat but keep it strictly optional between them and have them know it adds no extra security. just a "veil" over their messages. if they keypair is wrong then they themselves will not see the messages unless they remove it and use another one.

I dont know 100% if i am getting it right but thats what i understood so far from the research.

Good news is the browser can generate the keypair for me and store it. which is good. but i never implemented something like this before.
eh ill figure it out i always do.
  
---