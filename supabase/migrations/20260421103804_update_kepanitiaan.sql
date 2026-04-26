CREATE TYPE event_tipe AS enum ('kajian', 'rapat_pleno', 'rapat_panitia', 'event_besar');

CREATE TABLE public.committees (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.events
ADD COLUMN tipe_kegiatan event_tipe DEFAULT 'kajian',
ADD COLUMN committee_id uuid REFERENCES public.committees(id) ON DELETE SET NULL;

CREATE TABLE public.committee_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    committee_id uuid REFERENCES public.committees(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    divisi text NOT NULL,
    posisi text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(committee_id, user_id)
);

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anggota bisa lihat daftar kepanitiaan" 
ON public.committees FOR SELECT 
USING (public.get_user_role() != 'guest');

CREATE POLICY "Pengurus bisa buat/edit kepanitiaan" 
ON public.committees FOR ALL 
USING (public.get_user_role() = 'pengurus');

ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anggota bisa lihat susunan panitia" 
ON public.committee_members FOR SELECT 
USING (public.get_user_role() != 'guest');

CREATE POLICY "Pengurus bisa atur anggota panitia" 
ON public.committee_members FOR INSERT 
WITH CHECK (
  public.get_user_role() = 'pengurus'
  AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role IN ('anggota_biasa', 'pengurus')
  )
);

CREATE OR REPLACE FUNCTION public.validasi_role_panitia()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id 
    AND role IN ('anggota_biasa', 'pengurus')
  ) THEN
    RAISE EXCEPTION 'Akses Ditolak: Anggota Muda atau Guest tidak diperbolehkan menjadi panitia.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_validasi_role_panitia
  BEFORE INSERT OR UPDATE ON public.committee_members
  FOR EACH ROW EXECUTE PROCEDURE public.validasi_role_panitia();

CREATE OR REPLACE FUNCTION public.cegah_muda_ikut_rapat()
RETURNS trigger AS $$
DECLARE
  v_role user_role;
  v_tipe event_tipe;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = NEW.user_id;
  
  SELECT tipe_kegiatan INTO v_tipe FROM public.events WHERE id = NEW.event_id;
  
  IF v_role = 'anggota_muda' AND v_tipe IN ('rapat_pleno', 'rapat_panitia') THEN
    RAISE EXCEPTION 'Akses Ditolak: Anggota Muda belum diperbolehkan mengikuti rapat.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_cegah_muda_ikut_rapat
  BEFORE INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE PROCEDURE public.cegah_muda_ikut_rapat();
