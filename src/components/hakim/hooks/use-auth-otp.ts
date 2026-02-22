"use client";

interface UseAuthOtpParams {
  api: { post: (path: string, body: unknown, token?: string) => Promise<any> };
  phone: string;
  otp: string;
  name: string;
  login: (user: any, token: string) => void;
  navigateTo: (view: string) => void;
  setPhone: (value: string) => void;
  setOtp: (value: string) => void;
  setOtpSent: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export function useAuthOtp({
  api,
  phone,
  otp,
  name,
  login,
  navigateTo,
  setPhone,
  setOtp,
  setOtpSent,
  setLoading,
}: UseAuthOtpParams) {
  const sendOtp = async (purpose: "LOGIN" | "REGISTRATION" = "LOGIN") => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/send-otp", { phone, purpose });
      if (res.success) {
        setOtpSent(true);
        if (res.otpCode) {
          // Delay alert slightly to let React render the OTP input field first
          setTimeout(() => {
            alert(`Development mode: Your OTP is ${res.otpCode}`);
          }, 100);
        }
      } else {
        alert(res.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-otp", { phone, otpCode: otp, name });
      if (res.success) {
        login(res.user, res.token);
        navigateTo("landing");
        setPhone("");
        setOtp("");
        setOtpSent(false);
      } else {
        alert(res.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, verifyOtp };
}
