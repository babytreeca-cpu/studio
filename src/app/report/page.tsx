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
import { submitReport } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const VIOLENCE_TYPES = [
  "Violencia física",
  "Violencia psicológica",
  "Violencia verbal",
  "Bullying",
  "Ciberbullying",
  "Acoso sexual",
  "Discriminación",
  "Otro"
];

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      tipoViolencia: formData.get('tipoViolencia') as string,
      descripcion: formData.get('descripcion') as string,
      fechaIncidente: formData.get('fechaIncidente') as string,
      lugar: formData.get('lugar') as string,
      involucrados: formData.get('involucrados') as string,
    };

    if (!data.tipoViolencia || !data.descripcion) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const result = await submitReport(data);
      router.push(`/report/success?code=${result.trackingCode}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el reporte. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
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
                <CardDescription className="text-base">
                  Describe lo sucedido con la mayor claridad posible.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8 py-6">
              <Alert className="bg-secondary/50 border-none">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-bold">Seguridad garantizada</AlertTitle>
                <AlertDescription className="text-primary/80">
                  Tu identidad está protegida. Este reporte no recolecta nombres ni correos electrónicos.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="tipoViolencia" className="font-semibold">Tipo de Situación <span className="text-destructive">*</span></Label>
                <Select name="tipoViolencia" required>
                  <SelectTrigger id="tipoViolencia" className="h-12 border-muted-foreground/20">
                    <SelectValue placeholder="Selecciona el tipo de violencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIOLENCE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="font-semibold">Descripción Detallada <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="descripcion" 
                  name="descripcion" 
                  placeholder="Explica qué ocurrió, quiénes estuvieron presentes y cómo te sientes..." 
                  className="min-h-[150px] border-muted-foreground/20 resize-none focus-visible:ring-primary" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaIncidente" className="font-semibold">Fecha aproximada</Label>
                  <Input 
                    type="date" 
                    id="fechaIncidente" 
                    name="fechaIncidente" 
                    className="h-12 border-muted-foreground/20" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lugar" className="font-semibold">Lugar del hecho</Label>
                  <Input 
                    id="lugar" 
                    name="lugar" 
                    placeholder="Ej. Patio central, salón de clase, baño..." 
                    className="h-12 border-muted-foreground/20" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="involucrados" className="font-semibold">Personas involucradas (Opcional)</Label>
                <Input 
                  id="involucrados" 
                  name="involucrados" 
                  placeholder="Nombres o descripciones (si los conoces)" 
                  className="h-12 border-muted-foreground/20" 
                />
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 flex flex-col items-stretch gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmas que los datos proporcionados son verídicos y buscas ayuda.</span>
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando reporte...
                  </>
                ) : (
                  <>
                    Enviar Reporte Anónimo
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}