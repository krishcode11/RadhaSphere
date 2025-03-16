import { useGSAP as useGSAPReact } from '@gsap/react';
import { useEffect } from 'react';
import gsap from 'gsap';

export const useGSAP = (callback, dependencies = [], config = {}) => {
  // Ensure GSAP is registered
  useEffect(() => {
    if (!gsap.registerPlugin) {
      console.warn('GSAP plugins not registered. Some animations may not work.');
    }
  }, []);

  // Wrap the original useGSAP hook with error handling
  return useGSAPReact(() => {
    try {
      // Create a context for cleanup
      const ctx = gsap.context(() => {
        callback();
      });

      // Return cleanup function
      return () => ctx.revert();
    } catch (error) {
      console.error('GSAP Animation Error:', error);
      // Return empty cleanup to prevent crashes
      return () => {};
    }
  }, dependencies, {
    scope: config.scope || undefined,
    dependencies: config.dependencies || undefined,
  });
};

export default useGSAP; 