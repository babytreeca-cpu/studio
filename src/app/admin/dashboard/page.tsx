'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert,
  Search,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Badge } from "@/components/ui/badge";

const MOCK_STATS = [
  { name: 'Física', value: 12, color: 'hsl(var(--primary))' },
  { name: 'Bullying', value: 25, color: 'hsl(var(--accent))' },
  { name: 'Psicológica', value: 18, color: '#F59E0B' },
  { name: 'Sexual', value: 4, color: '#EF4444' },
  { name: 'Verbal', value: 15, color: '#10B981' },
];

const MOCK_RECENT_REPORTS = [
  { id: '1', code: 'TR78XY', type: 'Bullying', date: 'Hoy, 10:30 AM', urgency: 'Crítico', status: 'Recibido' },
  { id: '2', code: 'NM45KK', type: 'Violencia Física', date: 'Hoy, 08:15 AM', urgency: 'Alto', status: 'En evaluación' },
  { id: '3', code: 'ZX90QW', type: 'Violencia Verbal', date: 'Ayer, 04:20 PM', urgency: 'Medio', status: 'Resuelto' },
  { id: '4', code: 'PL22MM', type: 'Ciberacoso', date: 'Ayer, 02:00 PM', urgency: 'Alto', status: 'En investigación' },
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">Admin LJSM</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <FileText className="w-5 h-5" />
            Reportes
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <BarChart3 className="w-5 h-5" />
            Estadísticas
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/admin/login">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Resumen del Sistema</h1>
            <p className="text-muted-foreground">Monitoreo en tiempo real de convivencia escolar.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="hidden sm:flex">
               <Search className="w-4 h-4 mr-2" />
               Buscar reporte
             </Button>
             <Button className="bg-primary shadow-lg">
               Exportar Datos
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-primary opacity-60" />
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-none">+12%</Badge>
              </div>
              <p className="text-3xl font-bold">74</p>
              <p className="text-sm text-muted-foreground">Total de Reportes</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 opacity-60" />
                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-none">Pendientes</Badge>
              </div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">En Evaluación</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className="w-5 h-5 text-destructive opacity-60" />
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-none">Críticos</Badge>
              </div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Nivel de Urgencia Crítico</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 opacity-60" />
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none">Cerrados</Badge>
              </div>
              <p className="text-3xl font-bold">48</p>
              <p className="text-sm text-muted-foreground">Casos Resueltos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts */}
          <Card className="lg:col-span-2 border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Reportes por Categoría</CardTitle>
              <CardDescription>Distribución de casos registrados este año</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'rgba(21, 101, 192, 0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {MOCK_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports List */}
          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recientes</CardTitle>
                <CardDescription>Últimos casos recibidos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-bold">
                Ver todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MOCK_RECENT_REPORTS.map((report) => (
                  <div key={report.id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full ${
                        report.urgency === 'Crítico' ? 'bg-destructive' : 
                        report.urgency === 'Alto' ? 'bg-orange-500' : 'bg-primary'
                      }`} />
                      <div>
                        <p className="font-bold text-sm">{report.type}</p>
                        <p className="text-xs text-muted-foreground">{report.date} • {report.code}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-primary/5">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">IA Insights</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Se ha detectado un incremento del 15% en reportes de <span className="font-bold">Bullying</span> durante la última semana en horarios de recreo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}