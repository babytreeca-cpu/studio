'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ArrowLeft, Loader2, Calendar, Clock, ShieldCheck, Info } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// 1. Importamos las herramientas de Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setError('');
    setReport(null);

    try {
      // 2. Buscamos el código exacto en el cajón de "reportes"
      const q = query(collection(db, "reportes"), where("codigoSeguimiento", "==", code.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Obtenemos los datos del reporte encontrado
        const data = querySnapshot.docs[0].data();
        
        // Formateamos la fecha para que se vea amigable
        let fechaReg = "Fecha no disponible";
        if (data.fechaCreacion) {
          fechaReg = data.fechaCreacion.toDate().toLocaleDateString('es-PE', {
            day: 'numeric', month: 'long', year: 'numeric'
          });
        }

        setReport({
          estado: data.estado,
          tipoViolencia: data.tipoViolencia,
          fechaRegistro: fechaReg,
          ultimaActualizacion: "En tiempo real"
        });
      } else {
        setError('No se encontró ningún reporte. Verifica que el código esté bien escrito.');
      }
    } catch (err) {
      console.error("Error consultando código:", err);
      setError('Error al consultar la base de datos. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  }

  // 3. Ajustamos la barra de progreso a los estados reales de tu panel
  const getStatusProgress = (status: string) => {
    switch(status) {
      case 'Pendiente': return 25;
      case 'En Revisión': return 60;
      case 'Resuelto': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <Card className="border-none shadow-xl">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary mb-4">
              <Search className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Consultar Estado de Reporte</CardTitle>
            <CardDescription>Ingresa tu código único para conocer el avance de tu caso.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="code" className="sr-only">Código de Seguimiento</Label>
                <Input 
                  id="code" 
                  placeholder="Ej. AB12CD" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="h-12 border-muted-foreground/20 font-mono text-center tracking-widest text-lg uppercase"
                />
              </div>
              <Button type="submit" disabled={loading || !code} className="h-12 px-6">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Consultar'}
              </Button>
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}

            {report && (
              <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Estado del Caso</h3>
                    <Badge variant="secondary" className={`text-lg py-1 px-4 border ${
                      report.estado === 'Pendiente' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                      report.estado === 'En Revisión' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {report.estado}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Última Actualización</h3>
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <Clock className="w-4 h-4 mr-1 opacity-60" />
                      {report.ultimaActualizacion}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Progreso del proceso</span>
                    <span className="text-primary font-bold">{getStatusProgress(report.estado)}%</span>
                  </div>
                  <Progress value={getStatusProgress(report.estado)} className="h-2 bg-primary/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary opacity-60" />
                      <span className="text-xs font-bold text-muted-foreground uppercase">Registrado el</span>
                    </div>
                    <p className="font-medium">{report.fechaRegistro}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-primary opacity-60" />
                      <span className="text-xs font-bold text-muted-foreground uppercase">Categoría de reporte</span>
                    </div>
                    <p className="font-medium">{report.tipoViolencia}</p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-sm text-primary/80">
                    <p className="font-bold mb-1">Información importante</p>
                    <p>El equipo de tutoría está gestionando esta información de manera confidencial. No compartas tu código de seguimiento con nadie.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-secondary/30 p-8 flex justify-center border-t">
             <p className="text-sm text-muted-foreground text-center">
               ¿Tienes nuevos detalles sobre este caso? <br/>
               <Link href="/report" className="text-primary font-bold hover:underline">Realiza un nuevo reporte</Link> indicando que es una actualización.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}