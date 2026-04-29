import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(303, '/login');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	let query = locals.supabase
		.from('events')
		.select('*')
		.order('date_time', { ascending: true });

	if (profile?.role === 'anggota_muda') {
		query = query.in('tipe_kegiatan', ['kajian', 'pelatihan', 'umum']);
	}

	const { data: events } = await query;

	return {
		events: events ?? [],
		userRole: profile?.role ?? 'guest'
	};
};
