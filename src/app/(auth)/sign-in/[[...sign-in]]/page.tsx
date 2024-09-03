import {
  ClerkLoaded,
  ClerkLoading,
  SignIn as ClerkSignIn,
} from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  return (
    <>
      <ClerkLoaded>
        <ClerkSignIn />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </>
  );
}
