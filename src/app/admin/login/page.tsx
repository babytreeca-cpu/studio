'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    await new Promise(r => setTimeout(r, 1000));
    
    // In a real app: signInWithEmailAndPassword(auth, email, password)
    toast({
      title: "Bienvenido",
      description: "Sesión iniciada correctamente.",
    });
    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio público
      </Link>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Report LJSM</h1>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="space-y-1 text-center py-8">
            <CardTitle className="text-2xl font-headline font-bold">Panel Administrativo</CardTitle>
            <CardDescription>Ingresa tus credenciales autorizadas</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 px-8 pb-8">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Institucional</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="nombre@ljsm.edu.pe" className="pl-10 h-11" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10 h-11" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-10">
              <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}