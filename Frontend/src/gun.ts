import Gun from 'gun';
import 'gun/sea';

// Connect to the Gun relay peer running on the backend.
// Start the backend first: cd Backend && node server.js  (runs on port 5000)
export const gun = Gun({
  peers: [process.env.REACT_APP_GUN_PEER_URL || 'http://localhost:5000/gun'],
});
