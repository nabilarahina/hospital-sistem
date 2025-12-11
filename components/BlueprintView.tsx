import React from 'react';
import { AgentRole } from '../types';
import { AGENTS } from '../constants';

const BlueprintView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Perancangan Sistem Agen Cerdas Rumah Sakit</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Dokumen ini menyajikan instruksi sistem inti untuk integrasi agen cerdas dalam Google AI Studio, 
          memastikan koordinasi yang efisien untuk manajemen pasien.
        </p>
      </div>

      {/* Coordinator Section */}
      <section className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-blue-200 pb-3">
          <div className="text-2xl">{AGENTS[AgentRole.COORDINATOR].icon}</div>
          <h2 className="text-xl font-bold text-blue-800">{AGENTS[AgentRole.COORDINATOR].name}</h2>
        </div>
        
        <p className="text-slate-700 mb-6">
          <strong>Deskripsi Sistem:</strong> Agen ini bertindak sebagai pusat utama untuk semua pertanyaan terkait rumah sakit, 
          dengan tugas merutekannya secara efisien ke sub-agen khusus yang paling sesuai.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mb-3">Instruksi & Peran Sentral</h3>
        <div className="bg-white rounded-lg border-l-4 border-yellow-400 p-4 shadow-sm">
          <p className="text-green-700 font-bold mb-3">
            Tujuan Utama (Ekspektasi Keluaran): Secara akurat merutekan permintaan pengguna ke sub-agen yang paling tepat.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li><strong>Identifikasi Inti Permintaan:</strong> Mengkategorikan permintaan ke: manajemen pasien, janji temu, info medis, atau laporan.</li>
            <li><strong>Pemilihan Sub-Agen:</strong> Memilih satu sub-agen yang paling relevan.</li>
            <li><strong>Ekstraksi Detail:</strong> Mengekstrak detail relevan untuk diteruskan.</li>
            <li><strong>Format Keluaran:</strong> Pemanggilan sub-agen terpilih dengan argumen.</li>
          </ol>
        </div>
      </section>

      {/* Medical Info Section */}
      <section className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 border-b-2 border-emerald-200 pb-3">
          <div className="text-2xl">{AGENTS[AgentRole.MEDICAL_INFO].icon}</div>
          <h2 className="text-xl font-bold text-emerald-800">{AGENTS[AgentRole.MEDICAL_INFO].name}</h2>
        </div>

        <p className="text-slate-700 mb-6">
          <strong>Deskripsi Sistem:</strong> Dirancang khusus untuk memberikan informasi mengenai kondisi medis, perawatan, obat-obatan, dan pertanyaan kesehatan umum.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 mb-3">Instruksi & Peran Spesialis</h3>
        <div className="bg-white rounded-lg border-l-4 border-yellow-400 p-4 shadow-sm">
          <p className="text-green-700 font-bold mb-3">
            Tujuan Utama: Menyampaikan informasi medis yang akurat dan mudah dipahami.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li><strong>Pencarian Sumber:</strong> Gunakan data terpercaya untuk kondisi medis/obat.</li>
            <li><strong>Respons Langsung:</strong> Jawab langsung pertanyaan medis.</li>
            <li><strong>Verifikasi Akurasi:</strong> Pastikan informasi valid.</li>
            <li><strong>Klarifikasi Bahasa:</strong> Gunakan format jelas, ringkas, mudah dipahami.</li>
            <li><strong>Penghindaran Jargon:</strong> Hindari atau jelaskan istilah teknis.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default BlueprintView;