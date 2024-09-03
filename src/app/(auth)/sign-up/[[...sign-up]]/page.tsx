import {
  ClerkLoaded,
  ClerkLoading,
  SignUp as ClerkSignUp,
} from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  return (
    <>
      <ClerkLoaded>
        <ClerkSignUp />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </>
  );
}
