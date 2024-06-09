import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimit } from "@/lib/api-limit";

export const Navbar = async () => {
  const apiLimitCount = await getApiLimit();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount}/>
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