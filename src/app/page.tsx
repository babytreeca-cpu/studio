import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, MessageSquarePlus, Search, UserCheck, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-headline tracking-tight text-primary">Report LJSM</span>
          </div>
          <Link href="/admin/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              <UserCheck className="w-4 h-4 mr-2" />
              Acceso Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary font-medium text-sm mb-6 animate-in fade-in slide-in-from-bottom-2">
            <ShieldCheck className="w-4 h-4" />
            100% Anónimo y Seguro
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6 leading-tight">
            Tu seguridad es nuestra prioridad. <br/>
            <span className="text-primary">Reporta sin miedo.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-body max-w-2xl mx-auto">
            Un espacio seguro para que la comunidad educativa de LJSM pueda reportar incidentes de convivencia de manera totalmente anónima. Estamos aquí para protegerte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                <MessageSquarePlus className="w-5 h-5 mr-2" />
                Realizar Reporte
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary transition-all">
                <Search className="w-5 h-5 mr-2" />
                Consultar Estado
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-20 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-secondary/30">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-primary">Privacidad Total</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No guardamos tu IP ni datos que puedan identificarte. Tu anonimato está garantizado tecnológicamente.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-secondary/30">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center mb-6">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-primary">Acción Inmediata</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Los reportes son revisados por nuestro equipo administrativo para brindar apoyo oportuno.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-secondary/30">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-3 text-primary">Seguimiento Real</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Con tu código único podrás ver el avance de tu caso sin tener que revelar quién eres.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-primary opacity-60">
            <Shield className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Report LJSM</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Institución Educativa LJSM. Sistema de Convivencia Escolar.
          </p>
        </div>
      </footer>
    </div>
  );
}