import { GoogleGenAI, Type } from "@google/genai";
import { AgentRole, CoordinatorResponse } from "../types";

// Initialize Gemini Client
// CRITICAL: Using process.env.API_KEY as strictly requested.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * The Coordinator Agent logic.
 * Analyzes input and outputs structured JSON for routing.
 */
export const coordinateRequest = async (userQuery: string): Promise<CoordinatorResponse> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for logic

  const systemInstruction = `
    Anda adalah Hospital System Coordinator. Tugas Anda adalah menganalisis permintaan pengguna 
    dan merutekannya ke SALAH SATU sub-agen berikut:
    
    1. ${AgentRole.PATIENT_MGMT} (Manajemen Pasien)
    2. ${AgentRole.APPOINTMENT} (Penjadwalan Janji Temu)
    3. ${AgentRole.MEDICAL_INFO} (Informasi Medis - Penyakit, Obat, Gejala)
    4. ${AgentRole.HOSPITAL_REPORT} (Pelaporan Rumah Sakit)

    Instruksi:
    - Identifikasi inti permintaan.
    - Pilih agen yang paling relevan.
    - Ekstrak detail penting.
    - Jika permintaan tidak jelas, default ke MEDICAL_INFORMATION_AGENT agar bisa diklarifikasi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetAgent: {
              type: Type.STRING,
              enum: [
                AgentRole.PATIENT_MGMT,
                AgentRole.APPOINTMENT,
                AgentRole.MEDICAL_INFO,
                AgentRole.HOSPITAL_REPORT
              ]
            },
            reasoning: { type: Type.STRING },
            forwardedQuery: { type: Type.STRING }
          },
          required: ["targetAgent", "reasoning", "forwardedQuery"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CoordinatorResponse;
    }
    throw new Error("Empty response from Coordinator");
  } catch (error) {
    console.error("Coordinator Error:", error);
    // Fallback safe mode
    return {
      targetAgent: AgentRole.MEDICAL_INFO,
      reasoning: "Gagal memproses routing, dialihkan ke bantuan umum.",
      forwardedQuery: userQuery
    };
  }
};

/**
 * The Medical Information Agent logic.
 * Provides medical info based on strict guidelines.
 */
export const getMedicalInformation = async (query: string): Promise<string> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    Anda adalah Medical Information Agent.
    
    Peran Anda: Spesialis informasi medis.
    Tujuan: Menyampaikan informasi medis yang akurat dan mudah dipahami.
    
    Pedoman:
    1. Jawab pertanyaan medis secara langsung.
    2. Informasi harus akurat (simulasi pencarian sumber terpercaya).
    3. Gunakan bahasa yang jelas, ringkas, dan mudah dipahami.
    4. Hindari jargon medis yang rumit, atau jelaskan jika perlu.
    5. Selalu tambahkan disclaimer bahwa ini adalah informasi AI dan bukan pengganti saran dokter profesional.
    6. Gunakan Bahasa Indonesia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3 // Lower temperature for accuracy
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan informasi saat ini.";
  } catch (error) {
    console.error("Medical Agent Error:", error);
    return "Terjadi kesalahan saat mengambil informasi medis. Silakan coba lagi.";
  }
};

/**
 * Generic mock handler for other agents
 */
export const getGenericAgentResponse = async (agentRole: string, query: string): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
    Anda adalah agen: ${agentRole} di sebuah Rumah Sakit.
    Jawablah permintaan pengguna: "${query}" sesuai kapasitas Anda.
    Berikan respon simulasi singkat (maksimal 2 paragraf) bahwa Anda sedang memproses permintaan ini.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: query,
      config: { systemInstruction }
    });
    return response.text || "Permintaan diproses.";
  } catch (error) {
    return "Sistem sedang sibuk.";
  }
};