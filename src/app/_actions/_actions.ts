/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from "@/zod/auth.validation";

export const changePasswordAction = async (
  payload: IChangePasswordPayload,
): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
  const parsedPayload = changePasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }
  try {
    const response = await httpClient.post("/auth/change-password", parsedPayload.data);

    if (!response) {
      return {
        success: false,
        message: "Failed to change password",
      };
    }

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to change password",
    };
  }
};
