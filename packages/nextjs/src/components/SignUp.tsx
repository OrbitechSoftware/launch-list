import z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { zodResolver } from "@hookform/resolvers/zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This email address is not valid."),
});

export type SignUpFormFields = z.infer<typeof signUpSchema>;

// TODO: Centralize
const apiUrl = "https://www.launchlist.app/api/v1/projects";

function FormWrapper({
  children,
  appearance,
}: {
  children: React.ReactNode;
  appearance?: string;
}) {
  return (
    <div
      data-testid="ll-signUpForm"
      className={twMerge(
        appearance ? appearance : "w-full my-6 bg-white p-6 rounded-md shadow"
      )}
    >
      {children}
      <p className="text-center mt-6 text-xs text-gray-600 italic">
        Powered by{" "}
        <a
          href="https://www.launchlist.app"
          rel="noreferrer"
          target="_blank"
          className="font-semibold hover:underline not-italic"
        >
          Launch<span className="text-orange-600">List</span>
        </a>
      </p>
    </div>
  );
}

type Props = {
  appearance?: {
    container?: string;
    button?: string;
    input?: string;
  };
};

export function SignUp(props: Props) {
  const projectId = process.env.NEXT_PUBLIC_LAUNCH_LIST_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_LAUNCH_LIST_API_KEY;

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SignUpFormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  if (!apiKey) {
    throw new Error(
      "LaunchList API key was not found. Make sure you have NEXT_PUBLIC_LAUNCH_LIST_API_KEY set."
    );
  }

  if (!projectId) {
    throw new Error(
      "LaunchList project was not found. Make sure you have NEXT_PUBLIC_LAUNCH_LIST_PROJECT_ID set."
    );
  }

  const addContactUrl = `${apiUrl}/${projectId}/contacts`;

  const handleSignUpSubmit = (data: SignUpFormFields) => {
    fetch(addContactUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    })
      .then((res) => {
        if (res.status >= 400 && res.status < 500) {
          throw new Error("Bad request");
        }

        if (res.status >= 500) {
          throw new Error("Internal server error");
        }

        setSubmitted(true);
      })
      .catch((err) => {
        setError("Uh oh! Something went wrong. Please try again later.");
        console.error(err);
      });
  };

  if (submitted) {
    return (
      <FormWrapper appearance={props.appearance?.container}>
        <p className="text-center text-green-600 text-sm">
          <span className="font-semibold">You&apos;re on the list! </span>
          <br />
          Thanks for signing up! Be sure to keep an eye on your email for any
          updates.
        </p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper appearance={props.appearance?.container}>
      <form onSubmit={form.handleSubmit(handleSignUpSubmit)}>
        {error && (
          <p className="text-sm text-red-600 mb-2 text-center">
            <span className="font-semibold">Uh oh! Something went wrong.</span>
            <br />
            {error}
          </p>
        )}
        <div className="flex flex-col space-y-2">
          <label htmlFor="emailAddress" className="text-sm text-gray-800">
            Email address
          </label>
          <input
            id="emailAddress"
            type="email"
            className={twMerge(
              props.appearance?.input
                ? props.appearance?.input
                : "border shadow-sm px-3 py-2 rounded-md block text-gray-800"
            )}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
          <button
            type="submit"
            className={twMerge(
              "bg-orange-600 font-semibold leading-6 text-white shadow-sm px-3 py-2 rounded-md text-sm",
              props.appearance?.button
            )}
            aria-disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </FormWrapper>
  );
}
