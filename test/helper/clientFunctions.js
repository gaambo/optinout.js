import { ClientFunction } from 'testcafe';

export const getLocalStorageItem = ClientFunction((key => {
  return localStorage.getItem(key); 
}));