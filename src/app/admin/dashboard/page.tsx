'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, AlertTriangle, CheckCircle, BarChart3, 
  LayoutDashboard, LogOut, ShieldAlert, Search, ArrowRight, Loader2, Download
} from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CHART_COLORS: Record<string, string> = {
  "Violencia física": "hsl(var(--primary))", "Bullying": "hsl(var(--accent))",
  "Violencia psicológica": "#F59E0B", "Acoso sexual": "#EF4444",
  "Violencia verbal": "#10B981", "Ciberbullying": "#3B82F6",
  "Discriminación": "#8B5CF6", "Otro": "#94a3b8"
};

const URGENCY_LEVELS: Record<string, string> = {
  "Violencia física": "Crítico", "Acoso sexual": "Crítico",
  "Bullying": "Alto", "Ciberbullying": "Alto", "Violencia psicológica": "Alto",
  "Violencia verbal": "Medio", "Discriminación": "Medio", "Otro": "Bajo"
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [allReportsData, setAllReportsData] = useState<any[]>([]); // Guardamos todo para exportar
  const [kpis, setKpis] = useState({ total: 0, pendientes: 0, criticos: 0, resueltos: 0 });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const q = query(collection(db, "reportes"), orderBy("fechaCreacion", "desc"));
        const querySnapshot = await getDocs(q);
        
        const allReports: any[] = [];
        const categoryCount: Record<string, number> = {};
        let pendientes = 0, criticos = 0, resueltos = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allReports.push({ id: doc.id, ...data });

          if (data.estado === "Pendiente") pendientes++;
          if (data.estado === "Resuelto") resueltos++;
          
          const urgencia = URGENCY_LEVELS[data.tipoViolencia] || "Medio";
          if (urgencia === "Crítico") criticos++;

          categoryCount[data.tipoViolencia] = (categoryCount[data.tipoViolencia] || 0) + 1;
        });

        setAllReportsData(allReports);
        setKpis({ total: allReports.length, pendientes, criticos, resueltos });

        const formattedChartData = Object.keys(categoryCount).map(key => ({
          name: key.replace("Violencia ", ""), value: categoryCount[key], color: CHART_COLORS[key] || "#000"
        }));
        setChartData(formattedChartData);

        const formattedRecent = allReports.slice(0, 4).map(report => {
          let dateStr = "Sin fecha";
          if (report.fechaCreacion) {
            const date = report.fechaCreacion.toDate();
            dateStr = date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
          }
          return {
            id: report.id, code: report.codigoSeguimiento, type: report.tipoViolencia,
            date: dateStr, urgency: URGENCY_LEVELS[report.tipoViolencia] || "Medio", status: report.estado
          };
        });
        setRecentReports(formattedRecent);

      } catch (error) {
        console.error("Error obteniendo reportes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Función Mágica para descargar en Excel/CSV
  const exportToCSV = () => {
    if (allReportsData.length === 0) return;

    const headers = ["Codigo", "Fecha del Sistema", "Estado", "Tipo", "Urgencia", "Fecha Incidente", "Lugar", "Involucrados", "Descripcion"];
    const csvRows = [headers.join(",")];

    allReportsData.forEach(r => {
      const fechaSis = r.fechaCreacion ? r.fechaCreacion.toDate().toLocaleDateString('es-PE') : "N/A";
      const urgencia = URGENCY_LEVELS[r.tipoViolencia] || "Medio";
      
      // Limpiamos las comillas y saltos de línea para que Excel no se rompa
      const escape = (text: string) => text ? `"${text.replace(/"/g, '""').replace(/\n/g, ' ')}"` : '""';

      const row = [
        r.codigoSeguimiento, fechaSis, r.estado, r.tipoViolencia, urgencia, 
        escape(r.fechaIncidente), escape(r.lugar), escape(r.involucrados), escape(r.descripcion)
      ];
      csvRows.push(row.join(","));
    });

    // Añadimos uFEFF para que Excel reconozca las tildes (UTF-8)
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reportes_LJSM_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-12 h-12 animate-spin" />
          <h2 className="text-xl font-bold font-headline">Cargando base de datos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 border-r bg-white flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">Admin LJSM</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <FileText className="w-5 h-5" /> Reportes
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <BarChart3 className="w-5 h-5" /> Estadísticas
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/admin/login">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Resumen del Sistema</h1>
            <p className="text-muted-foreground">Monitoreo en tiempo real de convivencia escolar.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/admin/reports">
               <Button variant="outline" className="hidden sm:flex">
                 <Search className="w-4 h-4 mr-2" /> Buscar reporte
               </Button>
             </Link>
             {/* AQUÍ CONECTAMOS EL BOTÓN EXPORTAR */}
             <Button onClick={exportToCSV} className="bg-primary shadow-lg">
               <Download className="w-4 h-4 mr-2" /> Exportar Datos
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2"><Users className="w-5 h-5 text-primary opacity-60" /></div>
              <p className="text-3xl font-bold">{kpis.total}</p><p className="text-sm text-muted-foreground">Total de Reportes</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 opacity-60" />
                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-none">Por revisar</Badge>
              </div>
              <p className="text-3xl font-bold">{kpis.pendientes}</p><p className="text-sm text-muted-foreground">Casos Pendientes</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className="w-5 h-5 text-destructive opacity-60" />
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-none">Atención rápida</Badge>
              </div>
              <p className="text-3xl font-bold">{kpis.criticos}</p><p className="text-sm text-muted-foreground">Nivel Crítico</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 opacity-60" />
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none">Finalizados</Badge>
              </div>
              <p className="text-3xl font-bold">{kpis.resueltos}</p><p className="text-sm text-muted-foreground">Casos Resueltos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Reportes por Categoría</CardTitle>
              <CardDescription>Distribución de casos registrados históricamente</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                      <Tooltip cursor={{fill: 'rgba(21, 101, 192, 0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">Aún no hay datos suficientes para la gráfica.</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recientes</CardTitle>
                <CardDescription>Últimos casos recibidos</CardDescription>
              </div>
              <Link href="/admin/reports">
                <Button variant="ghost" size="sm" className="text-primary font-bold">Ver todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <Link href="/admin/reports" key={report.id} className="flex items-center justify-between group cursor-pointer hover:bg-secondary/20 p-2 -mx-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${report.urgency === 'Crítico' ? 'bg-destructive' : report.urgency === 'Alto' ? 'bg-orange-500' : 'bg-primary'}`} />
                        <div>
                          <p className="font-bold text-sm">{report.type}</p>
                          <p className="text-xs text-muted-foreground">{report.date} • {report.code}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No hay reportes recientes.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}