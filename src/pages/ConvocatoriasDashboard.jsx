import React, { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import { CalendarDays, Plus, Save, X, Pencil, Trash2, Power, PowerOff } from "lucide-react";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const tipoOpciones = [
  "Todas",
  "🌾 Ext. Agropecuaria",
  "🌱 Agric. Familiar",
  "🌿 Ambiental",
  "🕊️ Víctimas / PDET",
  "🎭 Cultura Rural",
  "🔧 Insumos / Proyectos",
  "📌 Otras",
];

const prioridadOpciones = ["Baja", "Media", "Alta"];

const initialForm = {
  titulo: "",
  tipo_convocatoria: "Todas",
  vigente: "Sí",
  prioridad: "Media",
  publicador: "",
  permanente: "No",
  fecha_limite: "",
  descripcion: "",
  url: "",
};

const ConvocatoriasDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [convocatorias, setConvocatorias] = useState([]);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchConvocatorias = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await insforgeClient.database
        .from("convocatorias")
        .select("*");

      if (queryError) {
        throw queryError;
      }

      const normalized = Array.isArray(data)
        ? data.sort((left, right) =>
            (left.titulo || "").localeCompare(right.titulo || "", "es", { sensitivity: "base" })
          )
        : [];

      setConvocatorias(normalized);
    } catch (fetchError) {
      console.error(fetchError);
      setError("No pudimos cargar las convocatorias de la base de datos.");
      setConvocatorias([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setFormData({
      titulo: item.titulo || "",
      tipo_convocatoria: item.tipo_convocatoria || "Todas",
      vigente: item.vigente || "Sí",
      prioridad: item.prioridad || "Media",
      publicador: item.publicador || "",
      permanente: item.permanente || "No",
      fecha_limite: item.fecha_limite || "",
      descripcion: item.descripcion || "",
      url: item.url || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.url.trim()) {
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        titulo: formData.titulo.trim(),
        tipo_convocatoria: formData.tipo_convocatoria,
        vigente: formData.vigente,
        prioridad: formData.prioridad,
        publicador: formData.publicador.trim() || "No especificado",
        permanente: formData.permanente,
        fecha_limite: formData.fecha_limite.trim() || "Sin fecha",
        descripcion: formData.descripcion.trim(),
        url: formData.url.trim(),
      };

      if (isEditing && selectedConvocatoria) {
        const { error: updateError } = await insforgeClient.database
          .from("convocatorias")
          .update(payload)
          .eq("id", selectedConvocatoria.id);

        if (updateError) {
          throw updateError;
        }

        setMessage("Convocatoria actualizada correctamente.");
      } else {
        const { error: insertError } = await insforgeClient.database
          .from("convocatorias")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage("Convocatoria guardada correctamente.");
      }

      setFormData(initialForm);
      setIsEditing(false);
      setIsModalOpen(false);
      await fetchConvocatorias();
    } catch (submitError) {
      console.error(submitError);
      setError(isEditing
        ? "No pudimos actualizar la convocatoria en la base de datos."
        : "No pudimos guardar la convocatoria en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVigencia = async (item) => {
    const nextVigente = item.vigente === "Sí" ? "No" : "Sí";
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await insforgeClient.database
        .from("convocatorias")
        .update({ vigente: nextVigente })
        .eq("id", item.id);

      if (updateError) {
        throw updateError;
      }

      setMessage(`Convocatoria ${nextVigente === "Sí" ? "activada" : "desactivada"} correctamente.`);
      await fetchConvocatorias();
    } catch (toggleError) {
      console.error(toggleError);
      setError("No pudimos cambiar el estado de la convocatoria.");
    }
  };

  const handleDeleteConvocatoria = async (item) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la convocatoria "${item.titulo}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const { error: deleteError } = await insforgeClient.database
        .from("convocatorias")
        .delete()
        .eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      setMessage("Convocatoria eliminada correctamente.");
      if (selectedConvocatoria?.id === item.id) {
        setSelectedConvocatoria(null);
      }
      await fetchConvocatorias();
    } catch (deleteError) {
      console.error(deleteError);
      setError("No pudimos eliminar la convocatoria de la base de datos.");
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white">
                <CalendarDays size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Gestión de convocatorias
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Captura la convocatoria con los campos que necesitas y guárdala en la base de datos para que quede disponible en el panel.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 font-bold text-white shadow-md transition hover:bg-amber-400"
            >
              <Plus size={18} />
              Crear convocatoria
            </button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Convocatorias guardadas</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Ordenadas alfabéticamente por nombre. Desde cada fila puedes activar, editar o eliminar la convocatoria.
                </p>
              </div>
              <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
                {convocatorias.length} convocatorias
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                Cargando convocatorias de la base de datos...
              </div>
            ) : convocatorias.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                No hay convocatorias guardadas aún.
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <div className="max-h-136 overflow-y-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="px-3 py-2 font-semibold">Nombre</th>
                        <th className="px-3 py-2 font-semibold">Tipo</th>
                        <th className="px-3 py-2 font-semibold">Estado</th>
                        <th className="px-3 py-2 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {convocatorias.map((item) => (
                        <tr key={item.id} className="transition hover:bg-white">
                          <td className="px-3 py-2 align-top">
                            <span className="block max-w-[18rem] truncate font-semibold text-slate-900">
                              {item.titulo}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top whitespace-nowrap">{item.tipo_convocatoria}</td>
                          <td className="px-3 py-2 align-top whitespace-nowrap">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.vigente === "Sí" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                              {item.vigente === "Sí" ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleVigencia(item)}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                              >
                                {item.vigente === "Sí" ? <PowerOff size={14} /> : <Power size={14} />}
                                {item.vigente === "Sí" ? "Desactivar" : "Activar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteConvocatoria(item)}
                                className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
                  {isEditing ? "Editar convocatoria" : "Nueva convocatoria"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isEditing ? "Editar convocatoria" : "Crear convocatoria"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Título de la convocatoria</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej. Convocatoria de apoyo a productores"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Tipo de convocatoria</label>
                <select
                  name="tipo_convocatoria"
                  value={formData.tipo_convocatoria}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                >
                  {tipoOpciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">¿Está vigente?</label>
                <select
                  name="vigente"
                  value={formData.vigente}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                >
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                >
                  {prioridadOpciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">¿Quién lo publica?</label>
                <input
                  type="text"
                  name="publicador"
                  value={formData.publicador}
                  onChange={handleChange}
                  placeholder="🏛️ Finagro / Ministerio de Agricultura"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">¿Es permanente?</label>
                <select
                  name="permanente"
                  value={formData.permanente}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                >
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Fecha límite</label>
                <input
                  type="text"
                  name="fecha_limite"
                  value={formData.fecha_limite}
                  onChange={handleChange}
                  placeholder="Permanente (sujeto a disponibilidad)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe la convocatoria"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com/convocatoria"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 font-bold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
                >
                  <Save size={16} />
                  {isSaving ? (isEditing ? "Guardando cambios..." : "Guardando...") : isEditing ? "Guardar cambios" : "Guardar convocatoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConvocatoriasDashboard;
