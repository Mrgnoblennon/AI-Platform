import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";

export const Navbar = async () => {
  const apiLimitCount = await getApiLimit();
  const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
      <div className="flex w-full justify-end ">
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="animate-spin text-muted-foreground"/>
        </ClerkLoading>
      </div>
    </div>
  )
}