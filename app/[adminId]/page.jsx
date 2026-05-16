
import Home from "@/app/components/Home";
import { site, API_URL } from "../config/index";
import { headers } from 'next/headers'

export default async function page({ params }) {
  const { adminId } = params;
  console.log("Admin ID:", adminId)
  
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  
  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";

  // Simplified URL without posterId and verifyId
  const url = `${API_URL}/${site}/${adminId}/${device}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Page data:", data)

    if (data?.success === "exists") {
      return <Home adminId={adminId} />;
    }
  } catch (error) {
    console.error("Error fetching page data:", error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-xl font-bold text-gray-400">No Page found!!</div>
    </div>
  );
}
