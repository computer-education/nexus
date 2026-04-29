import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(303, '/login');

	// Proteksi: Hanya pengurus yang boleh bikin acara
	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (profile?.role !== 'pengurus') {
		throw redirect(303, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const type = formData.get('type');
		const date_time_raw = formData.get('date_time');
		const description = formData.get('description');

		if (!title || !type || !date_time_raw) {
			return fail(400, { error: 'Judul, Tipe, dan Waktu wajib diisi!' });
		}

        const date_time_wib = date_time_raw.toString()+"+07:00"

		const { error } = await locals.supabase.from('events').insert({
			title: title.toString(),
			tipe_kegiatan: type.toString(),
			date_time: date_time_wib,
			description: description?.toString() ?? ''
		});

		if (error) {
			console.error(error);
			return fail(500, { error: 'Gagal membuat acara: ' + error.message });
		}

		throw redirect(303, '/events');
	}
};
