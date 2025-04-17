import { useAuth } from "@/context/auth.context";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageWrapper } from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const emailValidationSchema = z.object({
  email: z.string().email({ message: "Email is invalid." }),
});

const passwordValidationSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const request = async () => {
    const result = passwordValidationSchema.safeParse({ password });
    if (!result.success) {
      return setError(result.error?.errors[0].message);
    }
    const response = await updatePassword(password);
    if (!response.error) {
      setError("");
      setMessage("Password updated");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setError("Failed to update password");
    }
  };

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
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-center text-red-600">{error}</p>
            )}
            {message && (
              <p className="mb-4 text-sm text-center text-green-600">
                {message}
              </p>
            )}
            {!message && (
              <div>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            {!message && (
              <Button className="w-full mb-4" onClick={request}>
                Update password
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { requestPasswordReset } = useAuth();

  const request = async () => {
    const result = emailValidationSchema.safeParse({ email });
    if (!result.success) {
      return setError(result.error?.errors[0].message);
    }
    const response = await requestPasswordReset(email);
    if (!response.error) {
      setError("");
      setMessage("Reset link sent to email");
    } else {
      setError("Failed to send reset link");
    }
  };

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
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-center text-red-600">{error}</p>
            )}
            {message && (
              <p className="mb-4 text-sm text-center text-green-600">
                {message}
              </p>
            )}
            {!message && (
              <div>
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            {!message && (
              <Button className="w-full mb-4" onClick={request}>
                Send reset link
              </Button>
            )}

            <div className="text-sm text-center">
              <Link to="/login" className="font-medium w-full">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
};
