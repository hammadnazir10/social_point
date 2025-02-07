import { v4 as uuidv4 } from 'uuid';

export const getAnonymousUserId = () => {
  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
};