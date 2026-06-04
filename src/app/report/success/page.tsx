'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Copy, Home, Search, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || 'ERROR';
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado",
      description: "El código de seguimiento ha sido copiado al portapapeles.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
        <Card className="border-none shadow-2xl text-center overflow-hidden">
          <div className="h-3 bg-green-500" />
          <CardHeader className="pt-10">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-foreground">¡Reporte Enviado!</CardTitle>
            <CardDescription className="text-lg">
              Tu reporte ha sido registrado de forma exitosa y anónima.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8">
            <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/10">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Código de Seguimiento</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-mono font-bold text-primary tracking-tighter">{code}</span>
                <Button variant="ghost" size="icon" onClick={copyCode} className="hover:bg-primary/10 text-primary">
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
              <p className="text-sm text-primary/80 leading-relaxed">
                <strong>Guarda este código.</strong> Es la única forma de consultar el estado de tu caso sin comprometer tu anonimato. No podemos recuperarlo si lo pierdes.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-8">
            <Link href="/track" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base rounded-xl border-2 hover:bg-secondary">
                <Search className="w-5 h-5 mr-2" />
                Ir a Consultar Estado
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full h-12 text-base rounded-xl text-muted-foreground">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}