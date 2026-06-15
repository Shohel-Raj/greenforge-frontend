import z from "zod";


export enum IdeaStatus {
  UNDER_REVIEW = "UNDER_REVIEW",
  DRAFT = "DRAFT",
}
//   title: "",
  // problemStatement: "",
  // solution: "",
  // description: "",
  // categoryId: "",
  // status: IdeaStatus.UNDER_REVIEW,
  // isPaid: false,
  // price: 0,
  // file: null,

export const createIdeaFormZodSchema = z.object({
  file: z.custom<File | null>().nullable(),
  data : z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  status: z.nativeEnum(IdeaStatus, { message: "Invalid status" }),
  problemStatement: z.string().min(1, { message: "Problem statement is required" }),
  solution: z.string().min(1, { message: "Solution is required" }),
  isPaid: z.boolean(),
  })
});

export type ICreateIdeaFormValues = z.infer<typeof createIdeaFormZodSchema>