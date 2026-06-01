-- Table: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  apellido text NOT NULL,
  correo_electronico text NOT NULL,
  telefono text NOT NULL,
  contraseña text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: convocatorias
CREATE TABLE IF NOT EXISTS convocatorias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  tipo_convocatoria text NOT NULL,
  vigente text NOT NULL,
  prioridad text NOT NULL,
  publicador text NOT NULL,
  permanente text NOT NULL,
  fecha_limite text NOT NULL,
  descripcion text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: fotos
CREATE TABLE IF NOT EXISTS fotos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  nombre_archivo text NOT NULL,
  imagen_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: planes
CREATE TABLE IF NOT EXISTS planes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio integer NOT NULL DEFAULT 0,
  descripcion text NOT NULL,
  duracion text NOT NULL DEFAULT 'Mensual',
  duracion_unidad text NOT NULL DEFAULT 'mensual',
  duracion_dias integer NOT NULL DEFAULT 30,
  fecha_inicio timestamptz NOT NULL DEFAULT now(),
  fecha_fin timestamptz,
  activo boolean NOT NULL DEFAULT true,
  destacado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
