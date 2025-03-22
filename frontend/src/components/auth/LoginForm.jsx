// frontend/src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function onSubmit(data) {
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage({type: 'error', text: error.message});
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
