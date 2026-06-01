import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, Trash2, X } from "lucide-react";
import { createClient } from "@insforge/sdk";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";
const STORAGE_KEY = "agrodasin-dashboard-photos";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const DashboardFotos = () => {
  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchPhotos = async () => {
      try {
        const { data, error: fetchError } = await insforgeClient.database
          .from("fotos")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (Array.isArray(data)) {
          setPhotos(data.map((item) => ({
            id: item.id,
            title: item.titulo,
            description: item.descripcion,
            name: item.nombre_archivo,
            src: item.imagen_url || item.imagen_data,
          })));
          return;
        }
      } catch (fetchError) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setPhotos(JSON.parse(saved));
          } catch (err) {
            console.error("Error leyendo fotos guardadas:", err);
          }
        }
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil(photos.length / PAGE_SIZE))));
  }, [photos.length]);

  const pageCount = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visiblePhotos = photos.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : pageCount));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < pageCount ? prev + 1 : 1));
  };

  const openModal = () => {
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewImageUrl("");
    setPreviewSrc("");
    setError("");
  };

  const savePhotoToDb = async ({ titulo, descripcion, nombre_archivo, imagen_url }) => {
    const formatError = (error) => {
      if (!error) return "";
      if (typeof error === "string") return error;
      if (error.message) return String(error.message);
      if (typeof error.error === "string") return error.error;
      return JSON.stringify(error);
    };

    const tryInsert = async (payload) => {
      return await insforgeClient.database.from("fotos").insert(payload).select().single();
    };

    const { data, error } = await tryInsert({ titulo, descripcion, nombre_archivo, imagen_url });
    if (!error) {
      return { data, error: null };
    }

    const message = formatError(error);
    const needsFallback = /imagen_url/i.test(message) && /(does not exist|no existe|column .* not found|unknown column|not found)/i.test(message);
    if (!needsFallback) {
      return { data: null, error };
    }

    const fallbackResult = await tryInsert({ titulo, descripcion, nombre_archivo, imagen_data: imagen_url });
    if (!fallbackResult.error) {
      return { data: fallbackResult.data, error: null };
    }

    return { data: null, error };
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    setNewImageUrl(url);
    setPreviewSrc(url);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newTitle.trim() || !newDescription.trim() || !newImageUrl.trim()) {
      setError("Llena todos los campos del formulario antes de guardar.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const fileName = newImageUrl.trim().split("/").pop() || "imagen-url";
      const payload = {
        titulo: newTitle.trim(),
        descripcion: newDescription.trim(),
        nombre_archivo: fileName,
        imagen_url: newImageUrl.trim(),
      };

      const { data, error: insertError } = await savePhotoToDb(payload);
      if (insertError) {
        throw insertError;
      }

      setPhotos((current) => [
        {
          id: data.id,
          title: data.titulo,
          description: data.descripcion,
          name: data.nombre_archivo,
          src: data.imagen_url || data.imagen_data || newImageUrl.trim(),
          _fallback: false,
        },
        ...current,
      ]);

      closeModal();
    } catch (submitError) {
      console.error("Error guardando foto en DB:", submitError);

      try {
        const fileName = newImageUrl.trim().split("/").pop() || "imagen-url";
        const fallback = {
          id: `local-${Date.now()}-${fileName}`,
          title: newTitle.trim(),
          description: newDescription.trim(),
          name: fileName,
          src: newImageUrl.trim(),
          _fallback: true,
        };

        setPhotos((current) => [fallback, ...current]);
        const dbMessage = submitError?.message || (submitError?.error && JSON.stringify(submitError.error)) || JSON.stringify(submitError);
        setError(`No se pudo guardar en la base de datos: ${dbMessage}. La imagen se guardó localmente como respaldo.`);
        closeModal();
      } catch (fallbackError) {
        console.error("Fallback local falló:", fallbackError);
        setError("No se pudo guardar la foto. Intenta de nuevo más tarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePhoto = async (photoId) => {
    setPhotos((current) => current.filter((photo) => photo.id !== photoId));

    try {
      await insforgeClient.database.from("fotos").delete().eq("id", photoId);
    } catch (deleteError) {
      console.warn("No se pudo eliminar de la base de datos:", deleteError);
    }
  };

  const handleRetryFallback = async (photoId) => {
    const photo = photos.find((p) => p.id === photoId && p._fallback);
    if (!photo) return;

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        titulo: photo.title || photo.name,
        descripcion: photo.description || "",
        nombre_archivo: photo.name || "",
        imagen_url: photo.src || "",
      };

      const { data, error: insertError } = await savePhotoToDb(payload);

      if (insertError) throw insertError;

      setPhotos((current) => current.map((p) => (p.id === photoId ? {
        id: data.id,
        title: data.titulo,
        description: data.descripcion,
        name: data.nombre_archivo,
        src: data.imagen_url || data.imagen_data,
        _fallback: false,
      } : p)));

      setError("Foto guardada en el servidor correctamente.");
    } catch (retryError) {
      console.error("Error reintentando guardar:", retryError);
      setError("No se pudo guardar en el servidor al reintentar. Revisa la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryAllFallbacks = async () => {
    const fallbacks = photos.filter((p) => p._fallback);
    if (fallbacks.length === 0) {
      setError("No hay imágenes pendientes de reintento en el servidor.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    let anyError = false;

    for (const photo of fallbacks) {
      try {
        const payload = {
          titulo: photo.title || photo.name,
          descripcion: photo.description || "",
          nombre_archivo: photo.name || "",
          imagen_url: photo.src || "",
        };

        const { data, error: insertError } = await savePhotoToDb(payload);
        if (insertError) throw insertError;

        setPhotos((current) => current.map((p) => (p.id === photo.id ? {
          id: data.id,
          title: data.titulo,
          description: data.descripcion,
          name: data.nombre_archivo,
          src: data.imagen_url || data.imagen_data,
          _fallback: false,
        } : p)));
      } catch (err) {
        console.error("Reintento falló para:", photo, err);
        anyError = true;
      }
    }

    setIsSubmitting(false);
    setError(anyError ? "Algunas imágenes no se pudieron guardar. Revisa la consola para más detalles." : "Todas las imágenes pendientes se guardaron en el servidor correctamente.");
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft size={18} /> Volver al dashboard
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Gestión de fotos
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Organiza y agrega imágenes al registro fotográfico
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Sube fotos del campo, revisa tu galería actual y elimina las imágenes que ya no necesites.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
          >
            <ImagePlus size={16} />
            <span className="ml-2">Agregar foto</span>
          </button>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fotos cargadas</h2>
              <p className="mt-2 text-sm text-slate-600">
                {photos.length} imagen{photos.length === 1 ? "" : "s"} en la galería.
              </p>
            </div>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="mt-10 rounded-4xl border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center text-slate-500">
              No hay imágenes cargadas aún. Usa el botón "Agregar foto" para añadir tu primera foto.
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePhotos.map((photo) => (
                  <div key={photo.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                      <img
                        src={photo.src}
                        alt={photo.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-900 truncate">{photo.title || photo.name}</p>
                      <p className="mt-2 text-sm text-slate-600 overflow-hidden max-h-16">
                        {photo.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{photo.name}</span>
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                          type="button"
                          aria-label="Eliminar foto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <p className="text-sm text-slate-600">
                  Mostrando {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, photos.length)} de {photos.length} fotos
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-semibold text-slate-600">
                    Página {currentPage} de {pageCount}
                  </span>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-4xl bg-white p-6 shadow-2xl sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Nueva foto</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Crear foto con título y descripción</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Título</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="Ej. Cosecha sostenible"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Descripción</span>
                  <textarea
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    placeholder="Breve descripción de la imagen"
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 resize-none"
                  />
                </label>
              </div>

              <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300">
                <span className="text-sm font-semibold text-slate-700">URL de la imagen</span>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/tu-foto.jpg"
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                />
              </label>

              {previewSrc && (
                <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-700">Vista previa</p>
                  <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <img src={previewSrc} alt="Vista previa" className="h-80 w-full object-cover" />
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto"
                >
                  {isSubmitting ? "Guardando..." : "Guardar foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardFotos;
