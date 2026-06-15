"use client";

import { createIdeaAction } from "@/app/_actions/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ICategory } from "@/types/catagory.types";
import {
  createIdeaFormZodSchema,
  IdeaStatus,
  type ICreateIdeaFormValues,
} from "@/zod/idea.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, RotateCcw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateIdeaFormProps {
  categories: ICategory[];
  isLoadingCategories?: boolean;
}

type CreateIdeaFormValues = Omit<ICreateIdeaFormValues, "file"> & {
  file: File | null;
};

const defaultValues: CreateIdeaFormValues = {
  file: null,
  data: {
    title: "",
    problemStatement: "",
    solution: "",
    description: "",
    categoryId: "",
    status: IdeaStatus.UNDER_REVIEW,
    isPaid: false,
    price: 0,
  },
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Invalid input";
};

const FieldMessage = ({ error }: { error: unknown }) => {
  if (!error) return null;

  return <p className="text-sm text-destructive">{getErrorMessage(error)}</p>;
};

const validatePrice = ({ value }: { value: number }) => {
  const result =
    createIdeaFormZodSchema.shape.data.shape.price.safeParse(value);

  if (result.success) return undefined;

  return result.error.issues[0]?.message ?? "Invalid price";
};

const CreateIdeaForm = ({
  categories,
  isLoadingCategories = false,
}: CreateIdeaFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdeaAction,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!value.file) {
        toast.error("Please choose an image for your idea");
        return;
      }

      const formData = new FormData();

      formData.append("file", value.file);
      formData.append(
        "data",
        JSON.stringify({
          title: value.data.title,
          problemStatement: value.data.problemStatement,
          solution: value.data.solution,
          description: value.data.description,
          categoryId: value.data.categoryId,
          status: value.data.status,
          isPaid: value.data.isPaid,
          price: value.data.price,
        }),
      );

      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create idea");
        return;
      }

      toast.success(result.message || "Your idea was created successfully");
      form.reset();

      void queryClient.invalidateQueries({ queryKey: ["ideas"] });
      void queryClient.refetchQueries({ queryKey: ["ideas"], type: "active" });
      router.refresh();
    },
  });

  const handleReset = () => {
    form.reset();
    toast.success("Form reset successfully");
  };

  return (
    <section className="w-full rounded-xl border bg-background shadow-sm">
      <div className="border-b bg-muted/30 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Sparkles className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Create a New Idea
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share the problem, your solution, and a few thoughtful details.
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="max-h-calc(100vh-16rem)">
        <div className="px-6 py-6">
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <form.Field
                name="data.title"
                validators={{
                  onChange: createIdeaFormZodSchema.shape.data.shape.title,
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Idea Title"
                    placeholder="Give your idea a clear name"
                  />
                )}
              </form.Field>

              <form.Field
                name="data.categoryId"
                validators={{
                  onChange: createIdeaFormZodSchema.shape.data.shape.categoryId,
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  const selectedCategory = categories.find(
                    (category) => category.id === field.state.value,
                  );

                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="idea-category"
                        className={cn(firstError && "text-destructive")}
                      >
                        Category
                      </Label>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                           if (!value) return;
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger
                          id="idea-category"
                          className={cn(
                            "w-full",
                            firstError && "border-destructive",
                          )}
                        >
                          <SelectValue placeholder="Choose a category">
                            {selectedCategory?.name}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldMessage error={firstError} />
                    </div>
                  );
                }}
              </form.Field>
              <form.Field
                name="data.status"
                validators={{
                  onChange: createIdeaFormZodSchema.shape.data.shape.status,
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="idea-status"
                        className={cn(firstError && "text-destructive")}
                      >
                        Status
                      </Label>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          if (!value) return;

                          field.handleChange(value as IdeaStatus);
                          field.handleBlur();
                        }}
                      >
                        <SelectTrigger
                          id="idea-status"
                          className={cn(
                            "w-full",
                            firstError && "border-destructive",
                          )}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value={IdeaStatus.UNDER_REVIEW}>
                            Submit for Review
                          </SelectItem>
                          <SelectItem value={IdeaStatus.DRAFT}>
                            Save as Draft
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FieldMessage error={firstError} />
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="file">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-image">Idea Image</Label>

                    <div className="flex items-center gap-3 rounded-md border bg-muted/20 px-3 py-2">
                      <ImagePlus className="size-4 text-muted-foreground" />
                      <input
                        id="idea-image"
                        type="file"
                        accept="image/*"
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.files?.[0] ?? null);
                        }}
                        className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name="data.isPaid">
                {(field) => (
                  <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3 md:col-span-2">
                    <div>
                      <Label>Paid Idea</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn this on if users need to pay before accessing it.
                      </p>
                    </div>

                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => {
                        field.handleChange(checked);

                        if (!checked) {
                          form.setFieldValue("data.price", 0);
                        }
                      }}
                    />
                  </div>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.values.data.isPaid}>
                {(isPaid) =>
                  isPaid ? (
                    <form.Field
                      name="data.price"
                      validators={{
                        onChange: validatePrice,
                      }}
                    >
                      {(field) => {
                        const firstError =
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? field.state.meta.errors[0]
                            : null;

                        return (
                          <div className="space-y-1.5">
                            <Label
                              htmlFor={field.name}
                              className={cn(firstError && "text-destructive")}
                            >
                              Price
                            </Label>

                            <input
                              id={field.name}
                              name={field.name}
                              type="number"
                              min={0}
                              value={field.state.value}
                              placeholder="Enter price"
                              onBlur={field.handleBlur}
                              onChange={(event) => {
                                field.handleChange(
                                  Number.isNaN(event.target.valueAsNumber)
                                    ? 0
                                    : event.target.valueAsNumber,
                                );
                              }}
                              aria-invalid={!!firstError}
                              className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                                firstError && "border-destructive",
                              )}
                            />

                            <FieldMessage error={firstError} />
                          </div>
                        );
                      }}
                    </form.Field>
                  ) : null
                }
              </form.Subscribe>

              <form.Field
                name="data.problemStatement"
                validators={{
                  onChange:
                    createIdeaFormZodSchema.shape.data.shape.problemStatement,
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  return (
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor={field.name}
                        className={cn(firstError && "text-destructive")}
                      >
                        Problem Statement
                      </Label>

                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="What problem does this idea solve?"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={!!firstError}
                        className={cn(firstError && "border-destructive")}
                      />

                      <FieldMessage error={firstError} />
                    </div>
                  );
                }}
              </form.Field>

              <form.Field
                name="data.solution"
                validators={{
                  onChange: createIdeaFormZodSchema.shape.data.shape.solution,
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  return (
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor={field.name}
                        className={cn(firstError && "text-destructive")}
                      >
                        Solution
                      </Label>

                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="Describe your solution"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={!!firstError}
                        className={cn(firstError && "border-destructive")}
                      />

                      <FieldMessage error={firstError} />
                    </div>
                  );
                }}
              </form.Field>

              <form.Field
                name="data.description"
                validators={{
                  onChange:
                    createIdeaFormZodSchema.shape.data.shape.description,
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  return (
                    <div className="space-y-1.5 md:col-span-2">
                      <Label
                        htmlFor={field.name}
                        className={cn(firstError && "text-destructive")}
                      >
                        Description
                      </Label>

                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="Add the details that make this idea shine"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={!!firstError}
                        className={cn(
                          "min-h-28",
                          firstError && "border-destructive",
                        )}
                      />

                      <FieldMessage error={firstError} />
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end w-full">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleReset}
                className="w-1/2 cursor-pointer "
              >
                <RotateCcw className="size-4" />
                Reset Fields
              </Button>
              <div className="w-1/2">
                <form.Subscribe
                  selector={(state) =>
                    [state.canSubmit, state.isSubmitting] as const
                  }
                >
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton
                      isPending={isSubmitting || isPending}
                      pendingLabel="Creating idea..."
                      disabled={!canSubmit || isLoadingCategories}
                      className={`${isSubmitting || isPending ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      Create Idea
                    </AppSubmitButton>
                  )}
                </form.Subscribe>
              </div>
            </div>
          </form>
        </div>
      </ScrollArea>
    </section>
  );
};

export default CreateIdeaForm;
