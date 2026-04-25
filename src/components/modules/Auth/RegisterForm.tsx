"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { IRegisterPayload } from "@/zod/auth.validation";
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import { IRegisterResponse } from "@/types/auth.types";

interface RegisterFormProps {
  redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ API CALL
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload),
  });

  // ✅ FORM
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
   onSubmit: async ({ value }) => {
  setServerError(null);

  if (value.password !== value.confirmPassword) {
    setServerError("Passwords do not match");
    return;
  }

  try {
    const payload = {
      name: value.name,
      email: value.email,
      password: value.password,
    };

   const res = await mutateAsync(payload);


const user = (res as IRegisterResponse).user;
if (!user) {
  setServerError("User data is missing in the response");
  return;
}

if (!user) {
  setServerError("User data is missing in the response");
  return;
}
if (!user.emailVerified) {
  router.push(`/verify-email?email=${user.email}`);
} else {
  router.push(redirectPath || "/login");
}

  } catch (err: any) {
    setServerError(err.message || "Something went wrong");
  }
},
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join EcoSpark Hub and start sharing ideas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* NAME */}
            <form.Field name="name">
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              )}
            </form.Field>

            {/* EMAIL */}
            <form.Field name="email">
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
              )}
            </form.Field>

            {/* PASSWORD */}
            <form.Field name="password">
              {(field) => (
                <div className="space-y-1 relative">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-[34px]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}
            </form.Field>

            {/* CONFIRM PASSWORD */}
            <form.Field name="confirmPassword">
              {(field) => (
                <div className="space-y-1 relative">
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-[34px]"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}
            </form.Field>

            {/* ERROR */}
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* SUBMIT */}
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isSubmitting || isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Creating...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
