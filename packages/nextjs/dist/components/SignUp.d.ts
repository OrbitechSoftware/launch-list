import z from "zod";
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type SignUpFormFields = z.infer<typeof signUpSchema>;
export default function SignUp(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SignUp.d.ts.map