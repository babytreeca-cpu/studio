'use client';

import { Button } from "@/components/ui/button";
// ¡Aquí agregamos "Search" para que la lupita funcione!
import { ShieldCheck, UserCheck, Search } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        // ¡Aquí cambiamos a .jpeg para que coincida exactamente con tu archivo!
        backgroundImage: "url('/fondo.jpeg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Capa oscura para que las letras blancas se lean perfectamente */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Todo el contenido va dentro de este div con z-10 para estar por encima del fondo */}
      <div className="relative z-10 flex-1 flex flex-col">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <span className="font-headline font-bold text-xl text-white">Report LJSM</span>
            </div>
            <Link href="/admin/login">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                <UserCheck className="w-4 h-4 mr-2" />
                Acceso Admin
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium text-sm">
              <ShieldCheck className="w-4 h-4" />
              100% Anónimo y Seguro
            </div>
            
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-white">
              Tu seguridad es nuestra prioridad. <br className="hidden md:block" />
              <span className="text-blue-400">Reporta sin miedo.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Un espacio seguro para que la comunidad educativa de la I.E. Libertador José de San Martín pueda reportar incidentes de convivencia de manera totalmente anónima. Estamos aquí para protegerte.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/report">
                <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Realizar Reporte
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Consultar Estado
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-gray-400 text-sm bg-black/40 backdrop-blur-sm border-t border-white/10">
          <p>© {new Date().getFullYear()} I.E. Libertador José de San Martín. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}