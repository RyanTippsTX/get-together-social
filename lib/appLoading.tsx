// this context provides access to the state used by the 'AppLoading' indicator component
import { createContext, useContext, useEffect, useState, FormEvent } from 'react';

interface AppLoadingContextInterface {
  appLoading: boolean;
  setAppLoading: Function;
}
export const AppLoadingContext = createContext<AppLoadingContextInterface | undefined>(undefined);

export function AppLoadingProvider({ ...props }) {
  const [appLoading, setAppLoading] = useState(false);

  return (
    <AppLoadingContext.Provider
      value={{
        appLoading,
        setAppLoading,
      }}
      {...props}
    />
  );
}

// hook for using app-wide Profile state & Profile mutation functions
export function useAppLoading() {
  const context = useContext(AppLoadingContext);
  if (context === undefined) {
    throw new Error('useAppLoading must be used within an AppLoadingProvider');
  }
  return context;
}
