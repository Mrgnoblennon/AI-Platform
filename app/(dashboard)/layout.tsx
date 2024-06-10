import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscriptions";

const DashboardLayout = async ({
  children
} : {
  children: React.ReactNode
}) => {
  const apiLimitCount = await getApiLimit(); 
  const isPro = await checkSubscription();

  return ( 
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y- bg-gray-900">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;