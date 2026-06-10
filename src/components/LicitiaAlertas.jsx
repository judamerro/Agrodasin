import React, { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle, Play, RefreshCw, Loader2, Zap } from "lucide-react";
import { licitiaApi } from "../services/licitiaApi";

const LicitiaAlertas = () => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const configured = licitiaApi.isConfigured();

  const fetchStatus = async () => {
    if (!configured) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await licitiaApi.getAgentesStatus();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runWatcher = async () => {
    setIsRunning(true);
    setError("");
    try {
      await licitiaApi.runWatcher();
      await fetchStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  if (!configured) {
    return (
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Agente Licitia — no configurado</h3>
            <p className="text-sm text-slate-600 mt-1">
              Agrega{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs">
                VITE_LICITIA_API_URL
              </code>{" "}
              en tu archivo <code className="text-xs">.env</code> para activar las alertas del agente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Agente Licitia</h3>
            <p className="text-xs text-slate-500">Monitoreo automático de licitaciones</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            title="Actualizar estado"
            className="p-2 rounded-xl bg-white border border-violet-200 text-violet-600 hover:border-violet-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
          <button
            onClick={runWatcher}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            {isRunning ? "Ejecutando..." : "Ejecutar watcher"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs text-rose-700 mb-3">
          <AlertTriangle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      {status && !isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(status)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl border border-violet-100 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                  {String(value ?? "—")}
                </p>
              </div>
            ))}
        </div>
      ) : !isLoading && !error ? (
        <div className="text-center py-5 text-slate-400">
          <CheckCircle size={26} className="mx-auto mb-2 opacity-25" />
          <p className="text-xs font-medium">Sin datos de estado disponibles</p>
        </div>
      ) : null}
    </div>
  );
};

export default LicitiaAlertas;
