
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Define allowed users
const ALLOWED_USERS = [
  { email: "rjrayan2548@gmail.com", password: "ranjan@qpgen" },
  { email: "qpgen1127@gmail.com", password: "qpgen@qpgen" },
  { email: "pavithranraja1729@gmail.com", password: "pavithran@qpgen" }
];

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if the user is in the allowed list
    const isAllowedUser = ALLOWED_USERS.some(
      user => user.email === email && user.password === password
    );

    if (!isAllowedUser) {
      toast.error("Invalid credentials or unauthorized access");
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist, create account
        if (error.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            toast.error(signUpError.message);
            return;
          }

          toast.success("Account created! Please check your email to verify your account.");
        } else {
          toast.error(error.message);
        }
      } else if (data.user) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
};
