import React, { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import {
  Users, Download, RefreshCw, Search, X, Eye,
  Trash2, MessageSquare, Loader2, AlertCircle, Zap, CheckCircle2,
} from "lucide-react";
import { licitiaApi } from "../services/licitiaApi";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY  = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

// ─── HELPERS ──────────────────────────────────────────────────

const ESTADOS = ["Nuevo", "Contactado", "En proceso", "Convertido"];

const ESTADO_STYLE = {
  Nuevo:       "bg-blue-100 text-blue-700 border-blue-200",
  Contactado:  "bg-amber-100 text-amber-700 border-amber-200",
  "En proceso":"bg-purple-100 text-purple-700 border-purple-200",
  Convertido:  "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const scoreStyle = (s) => {
  if (s >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "2-digit",
  });
};

const exportCSV = (data) => {
  const headers = [
    "Nombre", "Correo", "Celular", "Tipo Entidad", "Departamento",
    "Actividad Principal", "Objetivo Evaluado", "Score (0-100)", "Nivel",
    "Pilar Legal (%)", "Pilar Financiero (%)", "Pilar Experiencia (%)",
    "Brechas Bloqueantes", "Brechas Importantes", "Brechas Deseables",
    "Estado Seguimiento", "Notas", "Fecha Registro",
  ];
  const rows = data.map((d) => [
    d.nombre, d.correo, d.celular,
    d.tipo_entidad, d.departamento, d.actividad, d.objetivo,
    d.score, d.nivel,
    d.pilar_legal, d.pilar_financiero, d.pilar_experiencia,
    d.brechas_bloqueantes, d.brechas_importantes, d.brechas_deseables,
    d.estado || "Nuevo", d.notas || "",
    d.fecha_registro ? new Date(d.fecha_registro).toLocaleDateString("es-CO") : "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";")
    )
    .join("\r\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `CRM-AGRODASIN-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// ─── COMPONENTE ───────────────────────────────────────────────

const CrmDashboard = () => {
  const [leads,          setLeads]          = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [error,          setError]          = useState("");
  const [search,         setSearch]         = useState("");
  const [estadoFilter,   setEstadoFilter]   = useState("Todos");
  const [objetivoFilter, setObjetivoFilter] = useState("Todos");
  const [selectedLead,   setSelectedLead]   = useState(null);
  const [editingNotes,   setEditingNotes]   = useState("");
  const [isSaving,       setIsSaving]       = useState(false);
  const [syncStatus,     setSyncStatus]     = useState(null);

  // ── Carga ──
  const fetchLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data, error: e } = await insforgeClient.database
        .from("diagnosticos")
        .select("*");
      if (e) throw e;
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0)
      );
      setLeads(sorted);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los registros. Verifica que la tabla 'diagnosticos' exista en InsForge.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // ── Cambiar estado ──
  const updateEstado = async (id, estado) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado } : l)));
    if (selectedLead?.id === id) setSelectedLead((p) => ({ ...p, estado }));
    try {
      await insforgeClient.database.from("diagnosticos").update({ estado }).eq("id", id);
    } catch (err) { console.error(err); }
  };

  // ── Guardar notas ──
  const saveNotes = async () => {
    if (!selectedLead) return;
    setIsSaving(true);
    try {
      await insforgeClient.database
        .from("diagnosticos")
        .update({ notas: editingNotes })
        .eq("id", selectedLead.id);
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, notas: editingNotes } : l))
      );
      setSelectedLead((p) => ({ ...p, notas: editingNotes }));
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

  // ── Eliminar ──
  const deleteLead = async (id) => {
    if (!window.confirm("¿Eliminar este registro del CRM? Esta acción no se puede deshacer.")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
    try {
      await insforgeClient.database.from("diagnosticos").delete().eq("id", id);
    } catch (err) { console.error(err); }
  };

  // ── Sincronizar con Licitia ──
  const syncToLicitia = async () => {
    setSyncStatus("syncing");
    let success = 0;
    let failed = 0;
    for (const lead of filtered) {
      try {
        await licitiaApi.upsertCrmLead({
          email: lead.correo,
          nombre: lead.nombre,
          empresa: lead.actividad,
          telefono: lead.celular,
          fuente: "diagnostico",
          score: lead.score,
          nivel: lead.nivel,
          objetivo: lead.objetivo,
          departamento: lead.departamento,
        });
        success++;
      } catch {
        failed++;
      }
    }
    setSyncStatus(failed === 0 ? `ok:${success}` : `error:${failed}`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // ── Filtros ──
  const uniqueObjetivos = [
    "Todos",
    ...new Set(leads.map((l) => l.objetivo).filter(Boolean)),
  ];

  const filtered = leads.filter((l) => {
    const hay = `${l.nombre} ${l.correo} ${l.celular} ${l.departamento}`.toLowerCase();
    return (
      hay.includes(search.toLowerCase()) &&
      (estadoFilter === "Todos" || (l.estado || "Nuevo") === estadoFilter) &&
      (objetivoFilter === "Todos" || l.objetivo === objetivoFilter)
    );
  });

  // ── Stats ──
  const stats = [
    { label: "Total leads",  value: leads.length,                                              bg: "bg-white border-slate-200",   text: "text-slate-800" },
    { label: "Nuevos",       value: leads.filter((l) => !l.estado || l.estado === "Nuevo").length, bg: "bg-blue-50 border-blue-200",   text: "text-blue-800"  },
    { label: "Contactados",  value: leads.filter((l) => l.estado === "Contactado").length,        bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
    { label: "En proceso",   value: leads.filter((l) => l.estado === "En proceso").length,        bg: "bg-purple-50 border-purple-200", text: "text-purple-800" },
    { label: "Convertidos",  value: leads.filter((l) => l.estado === "Convertido").length,        bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
  ];

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CRM — Leads de Diagnóstico</h1>
            <p className="text-sm text-slate-500 mt-1">
              Usuarios que completaron el diagnóstico gratuito. Exporta a Excel y haz seguimiento.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            {licitiaApi.isConfigured() && (
              <button
                onClick={syncToLicitia}
                disabled={syncStatus === "syncing" || filtered.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                {syncStatus === "syncing" ? (
                  <><Loader2 size={15} className="animate-spin" /> Sincronizando...</>
                ) : syncStatus?.startsWith("ok") ? (
                  <><CheckCircle2 size={15} /> Sincronizado ({syncStatus.split(":")[1]})</>
                ) : syncStatus?.startsWith("error") ? (
                  <><AlertCircle size={15} /> {syncStatus.split(":")[1]} errores</>
                ) : (
                  <><Zap size={15} /> Sincronizar con Licitia</>
                )}
              </button>
            )}
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              <Download size={15} /> Exportar a Excel (.csv)
            </button>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              <RefreshCw size={15} /> Actualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
              <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo, ciudad..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
          >
            <option value="Todos">Todos los estados</option>
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>

          <select
            value={objetivoFilter}
            onChange={(e) => setObjetivoFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 max-w-56 truncate"
          >
            {uniqueObjetivos.map((o) => <option key={o}>{o}</option>)}
          </select>

          <span className="text-sm font-semibold text-slate-400 ml-auto">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm font-medium">Cargando registros...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-rose-500">
              <AlertCircle size={28} />
              <p className="text-sm font-semibold text-center max-w-sm">{error}</p>
              <p className="text-xs text-slate-400 text-center max-w-sm">
                Crea la tabla <code className="bg-slate-100 px-1 py-0.5 rounded">diagnosticos</code> en InsForge con los campos definidos en el diagnóstico.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Users size={44} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">
                {leads.length === 0 ? "Aún no hay diagnósticos registrados." : "No hay registros que coincidan con los filtros."}
              </p>
              {leads.length === 0 && (
                <p className="text-xs text-slate-400 mt-1">Los registros aparecerán aquí cuando los usuarios completen el diagnóstico gratuito.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Nombre / Contacto", "Objetivo", "Score", "Brechas", "Estado", "Fecha", "Acciones"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Nombre */}
                      <td className="px-4 py-3 max-w-52">
                        <p className="font-bold text-slate-900 truncate">{lead.nombre || "—"}</p>
                        {lead.correo && <p className="text-xs text-slate-400 truncate">{lead.correo}</p>}
                        {lead.celular && <p className="text-xs text-slate-400">{lead.celular}</p>}
                      </td>
                      {/* Objetivo */}
                      <td className="px-4 py-3 max-w-40">
                        <p className="text-xs text-slate-600 truncate">{lead.objetivo || "—"}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{lead.departamento}</p>
                      </td>
                      {/* Score */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${scoreStyle(lead.score || 0)}`}>
                          {lead.score || 0}/100
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{lead.nivel || "—"}</p>
                      </td>
                      {/* Brechas */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {(lead.brechas_bloqueantes || 0) > 0 && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full w-fit border border-rose-200">
                              {lead.brechas_bloqueantes} bloq.
                            </span>
                          )}
                          {(lead.brechas_importantes || 0) > 0 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full w-fit border border-amber-200">
                              {lead.brechas_importantes} imp.
                            </span>
                          )}
                          {(lead.brechas_bloqueantes || 0) === 0 && (lead.brechas_importantes || 0) === 0 && (
                            <span className="text-xs text-emerald-600 font-semibold">Sin críticas</span>
                          )}
                        </div>
                      </td>
                      {/* Estado */}
                      <td className="px-4 py-3">
                        <select
                          value={lead.estado || "Nuevo"}
                          onChange={(e) => updateEstado(lead.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none transition-colors ${ESTADO_STYLE[lead.estado || "Nuevo"]}`}
                        >
                          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
                        </select>
                      </td>
                      {/* Fecha */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400 font-medium">
                        {fmtDate(lead.fecha_registro)}
                      </td>
                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedLead(lead); setEditingNotes(lead.notas || ""); }}
                            title="Ver detalles y notas"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            title="Eliminar registro"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Nota de exportación */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-center">
            El archivo CSV se abre directamente en Microsoft Excel. Separador: punto y coma (;) — compatible con Excel en español.
          </p>
        )}
      </div>

      {/* ── MODAL DETALLE ─────────────────────────────────── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-1">Ficha de lead</p>
                <h3 className="text-xl font-bold text-slate-900">{selectedLead.nombre || "Sin nombre"}</h3>
                <p className="text-sm text-slate-500">{selectedLead.tipo_entidad} · {selectedLead.departamento}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Info de contacto */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Correo", value: selectedLead.correo },
                { label: "Celular", value: selectedLead.celular },
                { label: "Objetivo evaluado", value: selectedLead.objetivo },
                { label: "Actividad", value: selectedLead.actividad },
                { label: "Fecha diagnóstico", value: fmtDate(selectedLead.fecha_registro) },
              ].filter(f => f.value).map((f) => (
                <div key={f.label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{f.label}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Score */}
            <div className={`rounded-xl border p-4 mb-5 ${scoreStyle(selectedLead.score || 0)}`}>
              <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1 opacity-70">Score de preparación</p>
              <p className="text-3xl font-black">{selectedLead.score || 0}<span className="text-base font-bold">/100</span> — {selectedLead.nivel}</p>
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs font-semibold">
                <div><p className="opacity-60 uppercase tracking-wide">Legal</p><p className="text-lg font-black">{selectedLead.pilar_legal}%</p></div>
                <div><p className="opacity-60 uppercase tracking-wide">Financiero</p><p className="text-lg font-black">{selectedLead.pilar_financiero}%</p></div>
                <div><p className="opacity-60 uppercase tracking-wide">Experiencia</p><p className="text-lg font-black">{selectedLead.pilar_experiencia}%</p></div>
              </div>
            </div>

            {/* Brechas resumen */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
                {selectedLead.brechas_bloqueantes || 0} Bloqueante{selectedLead.brechas_bloqueantes !== 1 ? "s" : ""}
              </span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                {selectedLead.brechas_importantes || 0} Importante{selectedLead.brechas_importantes !== 1 ? "s" : ""}
              </span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                {selectedLead.brechas_deseables || 0} Deseable{selectedLead.brechas_deseables !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Estado */}
            <div className="mb-6">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Estado de seguimiento</p>
              <div className="flex flex-wrap gap-2">
                {ESTADOS.map((e) => (
                  <button
                    key={e}
                    onClick={() => updateEstado(selectedLead.id, e)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      (selectedLead.estado || "Nuevo") === e
                        ? `${ESTADO_STYLE[e]} ring-2 ring-offset-1`
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="mb-6">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">Notas de seguimiento</p>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                rows={5}
                placeholder="Anota llamadas realizadas, acuerdos, compromisos, próximos pasos, observaciones..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-emerald-400 transition"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-400">{editingNotes.length} caracteres</p>
                <button
                  onClick={saveNotes}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar notas"}
                </button>
              </div>
            </div>

            {/* WhatsApp */}
            {selectedLead.celular && (
              <a
                href={`https://wa.me/57${selectedLead.celular.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${selectedLead.nombre}, soy asesor de AGRODASIN. Vi tu diagnóstico (score ${selectedLead.score}/100) y me gustaría ayudarte a cerrar las brechas identificadas. ¿Tienes un momento?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
              >
                <MessageSquare size={16} /> Contactar por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
