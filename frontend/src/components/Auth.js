"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email to confirm your account.");
  };

  const signIn = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert("Logged in!");
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button onClick={signUp}>Sign Up</Button>
      <Button onClick={signIn} variant="outline">
        Sign In
      </Button>
    </div>
  );
}

