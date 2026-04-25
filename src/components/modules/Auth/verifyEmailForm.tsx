"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
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
import { httpClient } from "@/lib/axios/httpClient";

interface EmailVerifyProps {
  email?: string;
}

const VerifyEmailForm = ({ email }: EmailVerifyProps) => {
  const router = useRouter();

  // ✅ STATE
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ✅ VERIFY MUTATION
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) =>
      verifyEmailAction(payload),
  });

  // ✅ VERIFY HANDLER
  const handleVerify = async () => {
    setError(null);
    setSuccess(null);

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      const res = await mutateAsync({ email, otp });

      // ✅ Handle ApiErrorResponse
      if ("success" in res && res.success === false) {
        setError(res.message);
        return;
      }

      // ✅ Success
      setSuccess("Email verified successfully 🎉");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    }
  };

  // ✅ RESEND OTP
  const handleResend = async () => {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email is missing");
      return;
    }

    try {
      await httpClient.post("/auth/resend-otp", { email });
      setSuccess("OTP resent successfully");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to resend OTP"
      );
    }
  };

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
              {email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* OTP INPUT */}
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

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
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;