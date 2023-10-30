import "@testing-library/jest-dom";
import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SignUp } from "../src";

describe("<SignUp />", () => {
  beforeAll(() => {
    vi.stubEnv("NEXT_PUBLIC_LAUNCH_LIST_API_KEY", "TEST_API_KEY");
    vi.stubEnv("NEXT_PUBLIC_LAUNCH_LIST_PROJECT_ID", "TEST_PROJECT_ID");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("Renders the component", async () => {
    render(<SignUp />);

    await waitFor(() => {
      const element = screen.getByTestId("ll-signUpForm");
      expect(element).toBeInTheDocument();
    });
  });
});
