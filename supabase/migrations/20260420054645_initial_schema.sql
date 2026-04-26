-- Buat tipe role
CREATE TYPE user_role AS ENUM ('guest', 'pending_approval', 'anggota_muda', 'anggota_biasa', 'pengurus');

-- Tabel 1: Profil (Data Anggota)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  nim text UNIQUE,
  prodi text,
  whatsapp text,
  role user_role DEFAULT 'guest',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabel 2: Events (Manajemen Kegiatan/Kajian)
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  date_time timestamp with time zone NOT NULL,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabel 3: Pendaftaran & Absensi Event
CREATE TABLE public.event_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_attended boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(event_id, user_id)
);

-- Fungsi & Trigger
CREATE OR REPLACE FUNCTION public.get_user_role() RETURNS user_role LANGUAGE sql SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'guest');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.cegah_naik_pangkat() RETURNS trigger AS $$
BEGIN
  IF auth.uid() = NEW.id AND public.get_user_role() != 'pengurus' THEN
    IF NEW.role != OLD.role THEN
      IF OLD.role = 'guest' AND NEW.role = 'pending_approval' THEN
        -- Loloskan
      ELSE
        RAISE EXCEPTION 'Akses Ditolak: Kamu tidak bisa menaikkan pangkatmu sendiri!';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_cegah_naik_pangkat
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.cegah_naik_pangkat();

-- RLS & Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User bisa lihat profil sendiri" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Pengurus bisa lihat semua profil" ON public.profiles FOR SELECT USING (public.get_user_role() = 'pengurus');
CREATE POLICY "User bisa update profil sendiri" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Pengurus bisa update semua profil" ON public.profiles FOR UPDATE USING (public.get_user_role() = 'pengurus');

CREATE POLICY "Semua orang bisa lihat event public" ON public.events FOR SELECT USING (is_public = true);
CREATE POLICY "Anggota bisa lihat semua event" ON public.events FOR SELECT USING (public.get_user_role() != 'guest');
CREATE POLICY "Pengurus punya akses penuh ke event" ON public.events FOR ALL USING (public.get_user_role() = 'pengurus');

CREATE POLICY "User bisa lihat histori pendaftarannya sendiri" ON public.event_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Pengurus bisa lihat semua pendaftaran" ON public.event_registrations FOR SELECT USING (public.get_user_role() = 'pengurus');
CREATE POLICY "User bisa mendaftar event" ON public.event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Pengurus bisa mengubah status absensi (is_attended)" ON public.event_registrations FOR UPDATE USING (public.get_user_role() = 'pengurus');
