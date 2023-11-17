import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import sha256 from "crypto-js/sha256";
import { RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";

function SwapSession({ userAddress, tokenContractAddress, tokenId, title }) {
  const [sessionId, setSessionId] = useState("");
  const [sessionURL, setSessionURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const baseURL = "http://localhost:3001/swap";

  const generateSessionId = () => {
    if (!userAddress || !tokenContractAddress || !tokenId) {
      setError("Invalid token or user information.");
      return;
    }

    setIsLoading(true);
    console.log("Generating session ID...");

    try {
      const uniqueId = sha256(
        `${userAddress}-${tokenContractAddress}-${tokenId}-${Date.now()}`
      ).toString();
      setSessionId(uniqueId);
      console.log("Session ID set:", uniqueId);
      const sessionURL = `${baseURL}?session_id=${uniqueId}&userAddress=${encodeURIComponent(
        userAddress
      )}&title=${encodeURIComponent(title)}`;
      setSessionURL(sessionURL);
    } catch (e) {
      console.error("Error generating session ID:", e);
      setError("Failed to generate session ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    if (sessionURL) {
      navigator.clipboard
        .writeText(sessionURL)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000); // Reset copied state to false after 2 seconds
        })
        .catch(() => setError("Failed to copy URL to clipboard."));
    }
  };

  useEffect(() => {
    if (error) {
      alert(error);
      setError("");
    }
  }, [error]);

  return (
    <div className="flex flex-col overflow-hidden items-center w-96">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300"
        onClick={generateSessionId}
        disabled={isLoading}
      >
        {isLoading ? "Creating Session..." : "Create Swap Session"}
      </button>

      {sessionId && (
        <div className="flex flex-col items-center space-y-4 mt-5">
          <div className="bg-white p-4 rounded-md shadow-md">
            <QRCodeSVG value={sessionURL} size={150} />
          </div>

          <div className="text-center">
            <p className="mb-2 font-semibold text-lg">Session URL:</p>
            <div className="flex items-center space-x-2 border p-2 rounded-full">
              <input
                type="url"
                value={sessionURL}
                className="  rounded-md bg-transparent py-2 px-4 focus:outline-none w-full"
              />
              <span
                role="button"
                className="cursor-pointer text-blue-200 hover:underline"
                onClick={handleCopyClick}
              >
                {copied ? (
                  <RiFileCopy2Fill size={20} />
                ) : (
                  <RiFileCopy2Line size={20} />
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default SwapSession;
