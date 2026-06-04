'use server';
/**
 * @fileOverview A Genkit flow for AI-powered severity triage of incident reports.
 * 
 * - aiSeverityTriage - A function that analyzes a report description and suggests a concise summary and an urgency level.
 * - AdminAISeverityTriageInput - The input type for the aiSeverityTriage function.
 * - AdminAISeverityTriageOutput - The return type for the aiSeverityTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminAISeverityTriageInputSchema = z.object({
  reportDescription: z.string().describe('The detailed description of the incident report.'),
});
export type AdminAISeverityTriageInput = z.infer<typeof AdminAISeverityTriageInputSchema>;

const AdminAISeverityTriageOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the incident report.'),
  urgencyLevel: z.enum(['Bajo', 'Medio', 'Alto', 'Crítico']).describe('The suggested urgency level for the report. Possible values: Bajo, Medio, Alto, Crítico.'),
});
export type AdminAISeverityTriageOutput = z.infer<typeof AdminAISeverityTriageOutputSchema>;

const triagePrompt = ai.definePrompt({
  name: 'adminAISeverityTriagePrompt',
  input: {schema: AdminAISeverityTriageInputSchema},
  output: {schema: AdminAISeverityTriageOutputSchema},
  prompt: `Eres un asistente de IA experto en análisis de reportes de incidentes en entornos educativos.
Tu tarea es analizar la siguiente descripción de un reporte de violencia y realizar dos acciones:
1. Generar un resumen conciso y objetivo del incidente (máximo 50 palabras).
2. Determinar un nivel de urgencia basado en la gravedad del incidente.

Niveles de Urgencia posibles:
- "Bajo": Incidentes menores, que no representan un riesgo inmediato o significativo.
- "Medio": Incidentes que requieren atención, pero no de forma inmediata. Podrían escalar si no se atienden.
- "Alto": Incidentes graves que requieren atención prioritaria y pueden tener consecuencias serias.
- "Crítico": Incidentes extremadamente graves que representan un peligro inminente, un un daño significativo o violaciones graves de seguridad o derechos.

Asegúrate de que el resumen sea neutral y solo incluya hechos.
La salida debe ser un objeto JSON con las claves 'summary' y 'urgencyLevel'.

Descripción del reporte:
{{{reportDescription}}}`,
});

const adminAISeverityTriageFlow = ai.defineFlow(
  {
    name: 'adminAISeverityTriageFlow',
    inputSchema: AdminAISeverityTriageInputSchema,
    outputSchema: AdminAISeverityTriageOutputSchema,
  },
  async (input) => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);

export async function aiSeverityTriage(input: AdminAISeverityTriageInput): Promise<AdminAISeverityTriageOutput> {
  return adminAISeverityTriageFlow(input);
}
