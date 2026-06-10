import React, { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import { TrendingUp, Users, Target, Award, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({ baseUrl: INSFORGE_BASE_URL, anonKey: INSFORGE_ANON_KEY });

const Bar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: e } = await insforgeClient.database.from("diagnosticos").select("*");
        if (e) throw e;
        setLeads(Array.isArray(data) ? data : []);
      } catch {
        setError("No se pudieron cargar las métricas. Verifica la conexión con InsForge.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const total = leads.length;

  const byEstado = {
    Nuevo: leads.filter((l) => !l.estado || l.estado === "Nuevo").length,
    Contactado: leads.filter((l) => l.estado === "Contactado").length,
    "En proceso": leads.filter((l) => l.estado === "En proceso").length,
    Convertido: leads.filter((l) => l.estado === "Convertido").length,
  };

  const conversionRate =
    total > 0 ? ((byEstado.Convertido / total) * 100).toFixed(1) : "0.0";

  const avgScore =
    total > 0
      ? (leads.reduce((sum, l) => sum + (l.score || 0), 0) / total).toFixed(1)
      : "—";

  const byScore = {
    "Alto (70+)": { value: leads.filter((l) => (l.score || 0) >= 70).length, color: "bg-emerald-500", text: "text-emerald-700" },
    "Medio (40-69)": { value: leads.filter((l) => (l.score || 0) >= 40 && (l.score || 0) < 70).length, color: "bg-amber-400", text: "text-amber-700" },
    "Inicial (0-39)": { value: leads.filter((l) => (l.score || 0) < 40).length, color: "bg-rose-400", text: "text-rose-700" },
  };

  const topObjetivos = Object.entries(
    leads.reduce((acc, l) => {
      if (l.objetivo) acc[l.objetivo] = (acc[l.objetivo] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topDepts = Object.entries(
    leads.reduce((acc, l) => {
      if (l.departamento) acc[l.departamento] = (acc[l.departamento] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const FUNNEL = [
    { label: "Total leads captados", value: total, color: "bg-slate-300", text: "text-slate-700" },
    {
      label: "Alguna vez contactados",
      value: byEstado.Contactado + byEstado["En proceso"] + byEstado.Convertido,
      color: "bg-amber-300",
      text: "text-amber-800",
    },
    {
      label: "En proceso activo",
      value: byEstado["En proceso"] + byEstado.Convertido,
      color: "bg-purple-400",
      text: "text-purple-800",
    },
    { label: "Convertidos (clientes)", value: byEstado.Convertido, color: "bg-emerald-500", text: "text-emerald-800" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analítica de uso</h1>
            <p className="text-sm text-slate-500 mt-0.5">Métricas en tiempo real de diagnósticos y conversión</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-medium">Cargando métricas...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-rose-700">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { Icon: Users,      label: "Total leads",         value: total,              color: "text-slate-800",   bg: "bg-white border-slate-200"         },
                { Icon: TrendingUp, label: "Tasa de conversión",  value: `${conversionRate}%`, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                { Icon: Award,      label: "Score promedio",      value: avgScore,            color: "text-amber-700",   bg: "bg-amber-50 border-amber-200"      },
                { Icon: Target,     label: "Convertidos",         value: byEstado.Convertido, color: "text-violet-700",  bg: "bg-violet-50 border-violet-200"    },
              ].map(({ Icon, label, value, color, bg }) => (
                <div key={label} className={`rounded-2xl border p-5 ${bg}`}>
                  <Icon size={20} className={`mb-3 ${color}`} />
                  <p className={`text-3xl font-black ${color}`}>{value}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Embudo */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Embudo de conversión</h2>
              <div className="space-y-4">
                {FUNNEL.map(({ label, value, color, text }) => {
                  const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-sm font-semibold mb-1.5">
                        <span className="text-slate-600">{label}</span>
                        <span className={text}>
                          {value} <span className="font-normal text-slate-400">({pct}%)</span>
                        </span>
                      </div>
                      <Bar value={value} max={total} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Distribución de score */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">Distribución de score</h2>
                <div className="space-y-4">
                  {Object.entries(byScore).map(([label, { value, color, text }]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">{label}</span>
                        <span className={text}>{value}</span>
                      </div>
                      <Bar value={value} max={total} color={color} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top objetivos */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">Top objetivos</h2>
                {topObjetivos.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center mt-8">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {topObjetivos.map(([obj, count]) => (
                      <div key={obj} className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 truncate flex-1 leading-4">{obj}</span>
                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top departamentos */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">Top departamentos</h2>
                {topDepts.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center mt-8">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {topDepts.map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 truncate flex-1">{dept}</span>
                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {total === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">
                Aún no hay diagnósticos registrados. Las métricas aparecerán aquí cuando los usuarios completen el diagnóstico.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
