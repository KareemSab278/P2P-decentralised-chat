import Gun from 'gun';
import 'gun/sea';

// Connect to the Gun relay peer running on the backend.
// Start the backend first: cd Backend && node server.js  (runs on port 3000)
export const gun = Gun({
  peers: ['http://localhost:3000/gun'],
});
