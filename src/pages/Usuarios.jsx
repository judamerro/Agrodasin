import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@insforge/sdk";
import { Plus, User, Users, X } from "lucide-react";

const INSFORGE_BASE_URL = "https://56vbsgp4.us-east.insforge.app";
const INSFORGE_ANON_KEY = "ik_17fed0a4da225dddf1a566a667c2cb37";

const insforgeClient = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    telefono: "",
    contraseña: "",
  });

  const userCount = useMemo(() => users.length, [users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await insforgeClient.database
        .from("usuarios")
        .select("*");

      if (queryError) {
        throw queryError;
      }

      const normalizedUsers = Array.isArray(data)
        ? data
            .map((user) => ({
              ...user,
              correo_electronico: user.correo_electronico || user.correo || "",
            }))
            .sort((left, right) => {
              const leftDate = new Date(left.created_at || 0).getTime();
              const rightDate = new Date(right.created_at || 0).getTime();
              return rightDate - leftDate;
            })
        : [];

      setUsers(normalizedUsers);
    } catch (fetchError) {
      console.error(fetchError);
      setError("No pudimos cargar los usuarios de la base de datos.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.correo_electronico.trim() ||
      !formData.telefono.trim() ||
      !formData.contraseña.trim()
    ) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo_electronico: formData.correo_electronico.trim(),
        telefono: formData.telefono.trim(),
        contraseña: formData.contraseña,
      };

      const { error: insertError } = await insforgeClient.database
        .from("usuarios")
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage("Usuario creado correctamente.");
      setFormData({
        nombre: "",
        apellido: "",
        correo_electronico: "",
        telefono: "",
        contraseña: "",
      });
      setIsModalOpen(false);
      await fetchUsers();
    } catch (createError) {
      console.error(createError);
      setError("No pudimos crear el usuario en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Users size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Gestión de usuarios
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Aquí puedes ver los usuarios que están en la base de datos y crear nuevos registros con los campos requeridos.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Usuarios activos
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{userCount}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-emerald-500"
            >
              <Plus size={18} />
              Crear usuario
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="mt-8 space-y-3">
            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                Cargando usuarios de la base de datos...
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                No hay usuarios registrados en la base de datos.
              </div>
            ) : (
              users.map((user) => (
                <article
                  key={user.id || user.correo_electronico}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {user.nombre || "Sin nombre"} {user.apellido || ""}
                        </p>
                        <p className="text-sm text-slate-600">{user.correo_electronico}</p>
                        <p className="text-sm text-slate-500">Teléfono: {user.telefono}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Nuevo usuario
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Crear usuario
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

            <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="correo_electronico"
                  value={formData.correo_electronico}
                  onChange={handleInputChange}
                  placeholder="correo@agrodasin.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
                  className="rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isSaving ? "Guardando..." : "Guardar usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Usuarios;
