import { createContext, useContext, ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MotionContextType {
  prefersReducedMotion: boolean;
  duration: number;
}

const MotionContext = createContext<MotionContextType>({
  prefersReducedMotion: false,
  duration: 0.4,
});

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0.001 : 0.4;

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, duration }}>
      {children}
    </MotionContext.Provider>
  );
}
