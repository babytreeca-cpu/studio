'use server';

import { aiSeverityTriage } from "@/ai/flows/admin-ai-severity-triage";
import { v4 as uuidv4 } from 'uuid';

// Mock DB for the demo environment
const mockReports: any[] = [];

export type ReportStatus = 'Recibido' | 'En evaluación' | 'En investigación' | 'Resuelto' | 'Cerrado';

export async function submitReport(formData: {
  tipoViolencia: string;
  descripcion: string;
  fechaIncidente: string;
  lugar: string;
  involucrados?: string;
}) {
  // 1. Generate unique tracking code
  const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  // 2. Perform AI Triage
  let triageResult = { summary: '', urgencyLevel: 'Bajo' as any };
  try {
    triageResult = await aiSeverityTriage({
      reportDescription: formData.descripcion
    });
  } catch (error) {
    console.error("AI Triage failed:", error);
  }

  // 3. Construct final report object
  const report = {
    id: uuidv4(),
    codigoSeguimiento: trackingCode,
    fechaRegistro: new Date().toISOString(),
    ...formData,
    estado: 'Recibido' as ReportStatus,
    aiSummary: triageResult.summary,
    aiUrgency: triageResult.urgencyLevel,
    observacionesAdmin: '',
    ultimaActualizacion: new Date().toISOString()
  };

  // In a real app, save to Firestore:
  // await addDoc(collection(db, "reportes"), report);
  
  // For demo:
  console.log("New Report Submitted:", report);
  
  return { trackingCode };
}

export async function checkReportStatus(code: string) {
  // Real implementation would query Firestore where trackingCode == code
  // For demo, we simulate a response
  await new Promise(r => setTimeout(r, 500));
  
  if (code.length < 5) return null;

  return {
    estado: 'En evaluación' as ReportStatus,
    fechaRegistro: new Date().toLocaleDateString(),
    tipoViolencia: 'Bullying',
    ultimaActualizacion: new Date().toLocaleTimeString()
  };
}