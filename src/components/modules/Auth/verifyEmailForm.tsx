"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { IVerifyEmailPayload } from "@/zod/auth.validation";
import { verifyEmailAction } from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";

interface EmailVerifyProps {
  email?: string;
}

const OTP_LENGTH = 6;
const RESEND_TIME = 60;

const VerifyEmailForm = ({ email }: EmailVerifyProps) => {
  const router = useRouter();
console.log("this is from form" ,email)
  // OTP as array
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [timer, setTimer] = useState(RESEND_TIME);

  // ✅ TIMER
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ VERIFY MUTATION
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) =>
      verifyEmailAction(payload),
  });

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ✅ HANDLE BACKSPACE
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ HANDLE PASTE
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH);

    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);

    inputsRef.current[newOtp.length - 1]?.focus();
  };

  // ✅ VERIFY
  const handleVerify = async () => {
    setError(null);
    setSuccess(null);

    const otpValue = otp.join("");

    if (otpValue.length < OTP_LENGTH) {
      setError("Please enter complete OTP");
      return;
    }

    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      const res = await mutateAsync({ email, otp: otpValue });

      if ("success" in res && res.success === false) {
        setError(res.message);
        return;
      }

      setSuccess("Email verified successfully 🎉");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    }
  };

  // ✅ RESEND OTP
  // const handleResend = async () => {
  //   setError(null);
  //   setSuccess(null);

  //   if (!email) {
  //     setError("Email is missing");
  //     return;
  //   }

  //   try {
  //     await httpClient.post("/auth/resend-otp", { email });
  //     setSuccess("OTP resent successfully");
  //     setTimer(RESEND_TIME);
  //   } catch (err: any) {
  //     setError(
  //       err?.response?.data?.message || "Failed to resend OTP"
  //     );
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Verify Email
          </CardTitle>

          <CardDescription>
            Enter the OTP sent to <br />
            <span className="font-medium text-foreground">
              {email || "your email"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OTP INPUTS */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-bold"
              />
            ))}
          </div>

          {/* SUCCESS */}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* ERROR */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* VERIFY BUTTON */}
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>

          {/* RESEND */}
          {/* <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={timer > 0}
          >
            {timer > 0
              ? `Resend OTP in ${timer}s`
              : "Resend OTP"}
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;