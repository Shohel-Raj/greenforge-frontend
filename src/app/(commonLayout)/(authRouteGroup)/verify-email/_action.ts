/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";

export const verifyEmailAction = async (payload: IVerifyEmailPayload) => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedPayload.data),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to verify email",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};