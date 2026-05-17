import Home from "@/app/components/Home";
import { site, API_URL } from "@/app/config/index";
import { headers } from "next/headers";

export default async function page({ params }) {
  const { param1, param2 } = params;
  console.log("Two Params Route:", param1, param2);
  
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  
  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";

  // Dynamic URL with site name, param1, param2, and device
  const url = `${API_URL}/${site}/${param1}/${param2}/${device}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Two Params Page data:", data);

    if (data?.success === "exists") {
      return <Home adminId={param2} />;
    }
  } catch (error) {
    console.error("Error fetching dynamic page data:", error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-xl font-bold text-gray-400">No Page found!!</div>
    </div>
  );
}
