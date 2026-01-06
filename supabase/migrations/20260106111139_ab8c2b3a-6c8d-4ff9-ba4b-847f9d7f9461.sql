-- Add configurable tier thresholds to cycle_config
ALTER TABLE public.cycle_config
ADD COLUMN inicio_gatilho integer NOT NULL DEFAULT 4,
ADD COLUMN inicio_meta integer NOT NULL DEFAULT 7,
ADD COLUMN inicio_super_meta integer NOT NULL DEFAULT 9,
ADD COLUMN reinicio_gatilho integer NOT NULL DEFAULT 4,
ADD COLUMN reinicio_meta integer NOT NULL DEFAULT 9,
ADD COLUMN reinicio_super_meta integer NOT NULL DEFAULT 13;