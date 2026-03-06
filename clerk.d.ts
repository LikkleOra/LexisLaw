declare module '@clerk/nextjs' {
  import { ReactNode } from 'react';

  export function ClerkProvider({ children }: { children: ReactNode }): JSX.Element;
  
  export function SignInButton(props?: { 
    mode?: 'modal' | 'redirect';
    forceRedirectUrl?: string;
    fallbackRedirectUrl?: string;
  }): JSX.Element;
  
  export function SignUpButton(props?: { 
    mode?: 'modal' | 'redirect';
    forceRedirectUrl?: string;
    fallbackRedirectUrl?: string;
  }): JSX.Element;
  
  export function SignOutButton(props?: { 
    redirectUrl?: string;
  }): JSX.Element;
  
  export function UserButton(props?: {
    afterSignOutUrl?: string;
    afterSwitchSessionUrl?: string;
  }): JSX.Element;
  
  export function useAuth(): {
    isLoaded: boolean;
    userId: string | null;
    sessionId: string | null;
    getToken: () => Promise<string | null>;
  };
  
  export function useUser(): {
    isLoaded: boolean;
    isSignedIn: boolean | null;
    user: {
      id: string;
      emailAddresses: { emailAddress: string }[];
      firstName: string | null;
      lastName: string | null;
      imageUrl: string;
    } | null;
  };
  
  export function useSession(): {
    isLoaded: boolean;
    isSignedIn: boolean;
    getToken: () => Promise<string>;
  };
}

declare module '@clerk/nextjs/server' {
  import { NextRequest } from 'next/server';
  
  export function clerkMiddleware(...args: any[]): any;
  
  export function auth(): Promise<{
    userId: string | null;
    sessionId: string | null;
  }>;
}
