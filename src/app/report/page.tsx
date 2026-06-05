'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, Send, ArrowLeft, Loader2, Info } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const VIOLENCE_TYPES = [
  "Violencia física", "Violencia psicológica", "Violencia verbal",
  "Bullying", "Ciberbullying", "Acoso sexual", "Discriminación", "Otro"
];

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const tipoViolencia = formData.get('tipoViolencia') as string;
    const descripcion = formData.get('descripcion') as string;

    if (!tipoViolencia || !descripcion) {
      toast({ title: "Error", description: "Completa los campos obligatorios.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const codigoGenerado = Math.random().toString(36).substring(2, 8).toUpperCase();
      const reporteNuevo = {
        tipoViolencia, descripcion,
        fechaIncidente: formData.get('fechaIncidente') as string,
        lugar: formData.get('lugar') as string,
        involucrados: formData.get('involucrados') as string,
        codigoSeguimiento: codigoGenerado,
        estado: "Pendiente",
        fechaCreacion: serverTimestamp(),
      };
      await addDoc(collection(db, "reportes"), reporteNuevo);
      router.push(`/report/success?code=${codigoGenerado}`);
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
        </Link>
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="space-y-1 pt-8 px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-headline font-bold">Realizar Reporte Anónimo</CardTitle>
                <CardDescription>Describe lo sucedido con claridad.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8 py-6">
              <Alert className="bg-secondary/50 border-none">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Seguridad garantizada</AlertTitle>
                <AlertDescription className="text-primary/80">Tu identidad está protegida.</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="tipoViolencia" className="font-semibold">Tipo de Situación <span className="text-destructive">*</span></Label>
                <Select name="tipoViolencia" required>
                  <SelectTrigger className="h-12 border-muted-foreground/20"><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                  <SelectContent>{VIOLENCE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="font-semibold">Descripción <span className="text-destructive">*</span></Label>
                <Textarea id="descripcion" name="descripcion" className="min-h-[150px] border-muted-foreground/20" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="fechaIncidente">Fecha aproximada</Label><Input type="date" name="fechaIncidente" className="h-12" /></div>
                <div className="space-y-2"><Label htmlFor="lugar">Lugar</Label><Input name="lugar" className="h-12" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="involucrados">Involucrados</Label><Input name="involucrados" className="h-12" /></div>
            </CardContent>
            <CardFooter className="px-8 pb-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">
                <ShieldCheck className="w-4 h-4" /><span>Confirmas que los datos son verídicos.</span>
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Enviando...</> : <><Send className="mr-2 w-5 h-5" />Enviar Reporte</>}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}