const apiFetch = async (path, options = {}) => {
  const base = import.meta.env.VITE_LICITIA_API_URL;
  if (!base) throw new Error("VITE_LICITIA_API_URL no configurado");
  const headers = { ...options.headers };
  const token = import.meta.env.VITE_LICITIA_API_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
};

export const licitiaApi = {
  isConfigured: () => Boolean(import.meta.env.VITE_LICITIA_API_URL),

  getAgentesStatus: () => apiFetch("/agentes/status"),

  runWatcher: () => apiFetch("/agentes/watcher/run", { method: "POST" }),

  upsertCrmLead: (lead) =>
    apiFetch("/crm/lead/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }),

  // Pipeline principal: recibe FormData con files, nit_identifier, objeto_proceso
  analyzePipeline: (formData) =>
    apiFetch("/pro/pipeline/archivos", { method: "POST", body: formData }),

  // Exportar informe Excel de un resultado previo
  exportExcel: (pipelineResult) =>
    apiFetch("/pro/export/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pipelineResult),
    }),
};
