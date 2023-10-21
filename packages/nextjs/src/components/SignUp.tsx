import z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const signUpSchema = z.object({
  email: z.string().email(),
});

export type SignUpFormFields = z.infer<typeof signUpSchema>;

// TODO: Centralize
const apiUrl = "https://launchlist.app/api/v1/projects";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full my-6 bg-white p-6 rounded-md shadow">
      {children}
      <p className="text-center mt-6 text-xs text-gray-600 italic">
        Powered by{" "}
        <a
          href="https://launchlist.app"
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

export default function SignUp() {
  const projectId = process.env.NEXT_PUBLIC_LAUNCH_LIST_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_LAUNCH_LIST_API_KEY;

  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SignUpFormFields>({
    defaultValues: {
      email: "",
    },
  });

  if (!apiKey) {
    throw new Error(
      "LaunchList API key was not found. Make sure you have NEXT_PUBLIC_API_KEY set."
    );
  }

  if (!projectId) {
    throw new Error(
      "LaunchList project was not found. Make sure you have NEXT_PUBLIC_PROJECT_ID set."
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
      <Shell>
        <p className="text-center text-green-600 text-sm">
          <span className="font-semibold">You&apos;re on the list! </span>
          <br />
          Thanks for signing up! Be sure to keep an eye on your email for any
          updates.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
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
            className="border shadow-sm px-3 py-2 rounded-md block text-gray-800"
            {...form.register("email")}
          />
          <button
            type="submit"
            className="bg-orange-600 font-semibold leading-6 text-white shadow-sm px-3 py-2 rounded-md disabled:bg-orange-300 text-sm"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </Shell>
  );
}
