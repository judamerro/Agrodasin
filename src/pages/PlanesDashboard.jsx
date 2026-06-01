import { useEffect, useState } from "react";
import { createClient } from "@insforge/sdk";
import {
  BadgeDollarSign,
  Package2,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Save,
  Trash2,
  X,
} from "lucide-react";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const initialForm = {
  nombre: "",
  precio: "",
  descripcion: "",
  duracion: "Mensual",
  duracion_unidad: "mensual",
  duracion_dias: 30,
  destacado: "No",
};

const PlanesDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [planes, setPlanes] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPlanes = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await insforgeClient.database
        .from("planes")
        .select("*");

      if (queryError) {
        throw queryError;
      }

      const normalized = Array.isArray(data)
        ? data.sort((left, right) =>
            (left.nombre || "").localeCompare(right.nombre || "", "es", { sensitivity: "base" })
          )
        : [];

      const expiredItems = normalized.filter((item) => {
        const hasExpiredDate = item.fecha_fin && new Date(item.fecha_fin) < new Date();
        return hasExpiredDate && item.activo !== false;
      });

      if (expiredItems.length > 0) {
        await Promise.all(
          expiredItems.map((item) =>
            insforgeClient.database
              .from("planes")
              .update({ activo: false })
              .eq("id", item.id)
          )
        );
      }

      const refreshed = await insforgeClient.database.from("planes").select("*");
      const refreshedData = Array.isArray(refreshed.data)
        ? refreshed.data.sort((left, right) =>
            (left.nombre || "").localeCompare(right.nombre || "", "es", { sensitivity: "base" })
          )
        : [];

      setPlanes(refreshedData);
      return refreshedData;
    } catch (fetchError) {
      console.error(fetchError);
      setError("No pudimos cargar los planes desde la base de datos.");
      setPlanes([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPlanes = async () => {
      if (!isMounted) {
        return;
      }

      await fetchPlanes();
    };

    void loadPlanes();

    return () => {
      isMounted = false;
    };
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
    setSelectedPlan(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setSelectedPlan(item);
    setFormData({
      nombre: item.nombre || "",
      precio: String(item.precio ?? ""),
      descripcion: item.descripcion || "",
      duracion: item.duracion || "Mensual",
      duracion_unidad: item.duracion_unidad || "mensual",
      duracion_dias: Number(item.duracion_dias) || 30,
      destacado: item.destacado ? "Sí" : "No",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      setError("Completa el nombre y la descripción del plan antes de guardar.");
      return;
    }

    const precioNumerico = Number(formData.precio);
    if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
      setError("El precio debe ser un número válido mayor o igual a 0.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const unidad = formData.duracion_unidad || "mensual";
      const diasBase = {
        diario: 1,
        quince_dias: 15,
        mensual: 30,
        anual: 365,
      };
      const dias = (diasBase[unidad] ?? Number(formData.duracion_dias)) || 30;
      const fechaInicio = new Date();
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaFin.getDate() + dias);

      const payload = {
        nombre: formData.nombre.trim(),
        precio: precioNumerico,
        descripcion: formData.descripcion.trim(),
        duracion: formData.duracion.trim() || "Mensual",
        duracion_unidad: unidad,
        duracion_dias: dias,
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        activo: true,
        destacado: formData.destacado === "Sí",
      };

      if (isEditing && selectedPlan) {
        const { error: updateError } = await insforgeClient.database
          .from("planes")
          .update(payload)
          .eq("id", selectedPlan.id);

        if (updateError) {
          throw updateError;
        }

        setMessage("Plan actualizado correctamente.");
      } else {
        const { error: insertError } = await insforgeClient.database
          .from("planes")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }

        setMessage("Plan creado correctamente.");
      }

      setFormData(initialForm);
      setIsEditing(false);
      setSelectedPlan(null);
      setIsModalOpen(false);
      await fetchPlanes();
    } catch (submitError) {
      console.error(submitError);
      setError(isEditing
        ? "No pudimos actualizar el plan en la base de datos."
        : "No pudimos crear el plan en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDestacado = async (item) => {
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await insforgeClient.database
        .from("planes")
        .update({ destacado: !item.destacado })
        .eq("id", item.id);

      if (updateError) {
        throw updateError;
      }

      setMessage(`El plan ${item.destacado ? "dejó de estar" : "pasó a estar"} destacado.`);
      await fetchPlanes();
    } catch (toggleError) {
      console.error(toggleError);
      setError("No pudimos cambiar el estado destacado del plan.");
    }
  };

  const handleDeletePlan = async (item) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el plan "${item.nombre}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const { error: deleteError } = await insforgeClient.database
        .from("planes")
        .delete()
        .eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      setMessage("Plan eliminado correctamente.");
      await fetchPlanes();
    } catch (deleteError) {
      console.error(deleteError);
      setError("No pudimos eliminar el plan de la base de datos.");
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <Package2 size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Gestión de planes
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Crea, edita y destaca los planes de diagnóstico y pago desde una sola vista, manteniendo la base de datos sincronizada.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-bold text-white shadow-md transition hover:bg-emerald-400"
            >
              <Plus size={18} />
              Crear plan
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
                <h2 className="text-lg font-bold text-slate-900">Planes registrados</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Puedes resaltar un plan, editarlo o eliminarlo en cualquier momento.
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900">
                {planes.length} planes
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                Cargando planes desde la base de datos...
              </div>
            ) : planes.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                No hay planes guardados aún.
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {planes.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-3xl border p-5 shadow-sm transition ${item.destacado ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Plan</p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900">{item.nombre}</h3>
                      </div>
                      {item.destacado && (
                        <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                          Destacado
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-end gap-2">
                      <BadgeDollarSign size={18} className="text-emerald-600" />
                      <span className="text-2xl font-black text-slate-900">
                        ${Number(item.precio || 0).toLocaleString("es-CO")}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.descripcion}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1">Duración: {item.duracion || "Mensual"}</span>
                      <span className="rounded-full bg-white px-3 py-1">Vence: {item.fecha_fin ? new Date(item.fecha_fin).toLocaleDateString("es-CO") : "Sin fecha"}</span>
                      <span className={`rounded-full px-3 py-1 ${item.activo === false ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {item.activo === false ? "Caducado" : "Vigente"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleDestacado(item)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        {item.destacado ? <PowerOff size={14} /> : <Power size={14} />}
                        {item.destacado ? "Quitar destaque" : "Destacar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(item)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  {isEditing ? "Editar plan" : "Nuevo plan"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isEditing ? "Editar plan" : "Crear un plan"}
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
                <label className="mb-2 block text-sm font-semibold text-slate-800">Nombre del plan</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Diagnóstico Premium"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Precio (COP)</label>
                <input
                  type="number"
                  name="precio"
                  min="0"
                  step="1000"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="39000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Duración</label>
                <input
                  type="text"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  placeholder="Mensual"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Tipo de vigencia</label>
                <select
                  name="duracion_unidad"
                  value={formData.duracion_unidad}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                >
                  <option value="diario">Diario</option>
                  <option value="quince_dias">15 días</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">¿Destacado?</label>
                <select
                  name="destacado"
                  value={formData.destacado}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                >
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe qué incluye el plan y para quién está pensado."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 font-bold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <Save size={16} />
                  {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlanesDashboard;
