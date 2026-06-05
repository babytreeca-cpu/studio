'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldAlert, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';

// Importamos Firebase
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Función para buscar todos los reportes
  async function fetchReports() {
    try {
      const q = query(collection(db, "reportes"), orderBy("fechaCreacion", "desc"));
      const querySnapshot = await getDocs(q);
      
      const allReports: any[] = [];
      querySnapshot.forEach((doc) => {
        allReports.push({ id: doc.id, ...doc.data() });
      });
      
      setReports(allReports);
    } catch (error) {
      console.error("Error obteniendo reportes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  // Se ejecuta al cargar la página
  useEffect(() => {
    fetchReports();
  }, []);

  // Función para cambiar el estado del reporte (ej. de Pendiente a Resuelto)
  async function handleStatusChange(reportId: string, newStatus: string) {
    setUpdating(true);
    try {
      const reportRef = doc(db, "reportes", reportId);
      await updateDoc(reportRef, {
        estado: newStatus
      });
      
      toast({
        title: "Estado actualizado",
        description: `El reporte ahora está marcado como ${newStatus}.`
      });

      // Recargar la lista y actualizar el seleccionado
      await fetchReports();
      setSelectedReport((prev: any) => ({ ...prev, estado: newStatus }));

    } catch (error) {
      console.error("Error actualizando estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h2 className="text-xl font-bold">Cargando reportes...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Bandeja de Reportes</h1>
            <p className="text-muted-foreground">Gestión detallada de los casos de convivencia.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Columna Izquierda: Lista de Reportes */}
          <Card className="col-span-1 border-none shadow-lg bg-white overflow-hidden flex flex-col">
            <CardHeader className="border-b bg-secondary/10 pb-4">
              <CardTitle className="text-lg">Todos los casos ({reports.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No hay reportes registrados aún.
                </div>
              ) : (
                reports.map((report) => (
                  <div 
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-secondary/20 ${selectedReport?.id === report.id ? 'bg-secondary/30 border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-primary">{report.codigoSeguimiento}</span>
                      <Badge variant={report.estado === 'Resuelto' ? 'default' : 'secondary'} className={
                        report.estado === 'Pendiente' ? 'bg-orange-100 text-orange-700' : 
                        report.estado === 'Resuelto' ? 'bg-green-100 text-green-700' : ''
                      }>
                        {report.estado}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground truncate">{report.tipoViolencia}</p>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {report.descripcion}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Columna Derecha: Detalle del Reporte */}
          <Card className="col-span-1 lg:col-span-2 border-none shadow-lg bg-white overflow-y-auto">
            {selectedReport ? (
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-headline mb-2">{selectedReport.tipoViolencia}</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Código de seguimiento: <strong className="text-foreground">{selectedReport.codigoSeguimiento}</strong>
                    </p>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${
                    selectedReport.estado === 'Pendiente' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 
                    selectedReport.estado === 'Resuelto' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''
                  }`}>
                    Estado Actual: {selectedReport.estado}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-secondary/10 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> Fecha del incidente</p>
                    <p className="font-medium">{selectedReport.fechaIncidente || "No especificada"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/> Lugar del hecho</p>
                    <p className="font-medium">{selectedReport.lugar || "No especificado"}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/> Involucrados</p>
                    <p className="font-medium">{selectedReport.involucrados || "No especificado / Anónimo"}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary"/> Descripción del suceso
                  </h3>
                  <div className="p-6 border rounded-xl bg-white shadow-sm leading-relaxed whitespace-pre-wrap">
                    {selectedReport.descripcion}
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-lg font-bold mb-4">Acciones Administrativas</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                      onClick={() => handleStatusChange(selectedReport.id, "En Revisión")}
                      disabled={updating || selectedReport.estado === "En Revisión"}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Marcar en Revisión
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChange(selectedReport.id, "Resuelto")}
                      disabled={updating || selectedReport.estado === "Resuelto"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Resuelto
                    </Button>
                  </div>
                </div>

              </CardContent>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ningún reporte seleccionado</h3>
                <p>Haz clic en un reporte de la lista a la izquierda para ver todos sus detalles y gestionar su estado.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}