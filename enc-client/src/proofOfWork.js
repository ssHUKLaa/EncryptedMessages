import Gun from 'gun';
import 'gun/sea';

const proofOfWork = async (salt, difficulty) => {
    const target = '0'.repeat(difficulty); // Set the target string to match
  
    let nonce = 0;
    let result = '';
  
    while (!result.startsWith(target)) { // Continue until we find a result that matches the target
      nonce++;
      result = await Gun.SEA.work(salt, nonce); // Perform the proof of work computation
    }
  
    return { nonce, result };
  };