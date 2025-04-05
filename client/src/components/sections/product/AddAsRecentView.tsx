'use client'
import { useEffect } from 'react';

type Props = {
  id: number;
};

const AddAsRecentView = ({ id }: Props) => {

  useEffect(() => {
    
    const key = 'recent-view';

    try {
      const raw = sessionStorage.getItem(key);
       const stored: number[] = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(stored)) {
        throw new Error('Invalid format');
      }

  
   
      if (!stored.includes(id)) {
        const updated = [...stored, id];
        sessionStorage.setItem(key, JSON.stringify(updated));
      }
     
    } catch (error) {
      sessionStorage.setItem(key, JSON.stringify([id]));
    }
  }, [id]);

  return null;
};

export default AddAsRecentView;
