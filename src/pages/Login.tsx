import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageWrapper } from "@/components/page-wrapper";
import { useAuth } from "@/context/auth.context";
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long"),
});

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      await signIn(values),
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: ErrorResponse) => {
      setError(
        error.status === 401
          ? "Invalid email or password"
          : "An error occurred during login"
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    loginMutation.mutate(values);
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="mb-12 flex flex-col items-center text-center">
          <a
            href="https://flowlet.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/flowlet.png"
              alt="Flowlet Logo"
              width={100}
              height={100}
              className="mb-5"
            />
            <h1 className="text-5xl font-bold mb-4">Flowlet</h1>
          </a>
        </header>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-center text-red-600">{error}</p>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <Link
                        to="/forgot-password"
                        className="text-sm text-gray-600 hover:text-gray-800 relative t-[-10px]"
                      >
                        Forgot password?
                      </Link>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
}
