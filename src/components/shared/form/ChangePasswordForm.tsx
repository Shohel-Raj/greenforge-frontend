"use client";

import { changePasswordAction } from "@/app/_actions/_actions";
/* eslint-disable @typescript-eslint/no-explicit-any */

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from "@/zod/auth.validation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const ChangePasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changePasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
   onSubmit: async ({ value }) => {
  setServerError(null);
  setSuccessMsg(null);

  // ✅ check match (extra safety, even if zod already does it)
  if (value.newPassword !== value.confirmPassword) {
    setServerError("Passwords do not match");
    return;
  }

  // ✅ send only required fields
  const payload = {
    currentPassword: value.currentPassword,
    newPassword: value.newPassword,
  };

  try {
    const result = await mutateAsync(payload);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccessMsg("Password changed successfully!");
    form.reset();
  } catch (error: any) {
    setServerError(error.message);
  }
},
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Change Password
        </CardTitle>
        <CardDescription>
          Update your account password securely
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* CURRENT PASSWORD */}
          <form.Field
            name="currentPassword"
            validators={{
              onChange: changePasswordZodSchema.shape.currentPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="px-2"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            )}
          </form.Field>

          {/* NEW PASSWORD */}
          <form.Field
            name="newPassword"
            validators={{
              onChange: changePasswordZodSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="px-2"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            )}
          </form.Field>

          {/* CONFIRM PASSWORD */}
          <form.Field name="confirmPassword">
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="px-2"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            )}
          </form.Field>

          {/* ERROR */}
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* SUCCESS */}
          {successMsg && (
            <Alert>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          {/* SUBMIT */}
          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Updating..."
                disabled={!canSubmit}
              >
                Change Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;