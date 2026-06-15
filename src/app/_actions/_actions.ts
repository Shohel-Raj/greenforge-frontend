/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from "@/zod/auth.validation";
import {
  createIdeaFormZodSchema,
  ICreateIdeaFormValues,
} from "@/zod/idea.validation";

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
    const response = await httpClient.post(
      "/auth/change-password",
      parsedPayload.data,
    );

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


export const createIdeaAction = async (
  formData: FormData,
): Promise<
  { success: boolean; message: string; data?: unknown } | ApiErrorResponse
> => {
  const file = formData.get("file");
  const rawData = formData.get("data");

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "File is required",
    };
  }

  if (typeof rawData !== "string") {
    return {
      success: false,
      message: "Idea data is required",
    };
  }

  const payload: ICreateIdeaFormValues = {
    file,
    data: JSON.parse(rawData),
  };

  const parsedPayload = createIdeaFormZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post("/ideas", parsedPayload.data.data, {
      files: {
        file: parsedPayload.data.file as File,
      },
    });

    if (!response) {
      return {
        success: false,
        message: "Failed to create idea",
      };
    }

    return {
      success: true,
      message: "Idea created successfully",
      data: response.data,
    };
  } catch (error: unknown) {
    const message =
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : "Failed to create idea";

    return {
      success: false,
      message,
    };
  }
};