import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(303, '/login');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (session && profile?.role !== 'guest') {
		throw redirect(303, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(303, '/login');

		// Tangkap data dari form HTML
		const formData = await request.formData();
		const nim = formData.get('nim');
		const prodi = formData.get('prodi');
		const whatsapp = formData.get('whatsapp');

		// Validasi sederhana
		if (!nim || !prodi || !whatsapp) {
			return fail(400, { error: 'Semua kolom wajib diisi ya!' });
		}

		// Eksekusi update ke Supabase (berjalan di server Cloudflare/Node)
		const { error } = await locals.supabase
			.from('profiles')
			.update({
				nim: nim.toString(),
				prodi: prodi.toString(),
				whatsapp: whatsapp.toString(),
				role: 'pending_approval' // Otomatis naik kasta
			})
			.eq('id', session.user.id);

		if (error) {
			return fail(500, { error: 'Gagal menyimpan data. Coba lagi nanti.' });
		}

		// Kalau sukses, langsung lempar ke Dashboard.
		// Karena lewat server, Hooks akan otomatis membaca kasta barunya!
		throw redirect(303, '/');
	}
};
