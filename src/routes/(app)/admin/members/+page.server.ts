import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;
	if (!session) throw redirect(303, '/login');

	const { data: myProfile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (myProfile?.role !== 'pengurus') {
		throw redirect(303, '/');
	}

	const { data: members } = await locals.supabase
		.from('profiles')
		.select('*')
		.in('role', ['pending_approval', 'anggota_muda'])
		.order('role', { ascending: false });

	return { members: members ?? [] };
};

export const actions: Actions = {
	setujui: async ({ request, locals }) => {
		const formData = await request.formData();
		const targetId = formData.get('id');

		const { error } = await locals.supabase
			.from('profiles')
			.update({ role: 'anggota_muda' })
			.eq('id', targetId);

		if (error) return fail(500, { error: 'Gagal menyetujui anggota.' });
	},

	naikPangkat: async ({ request, locals }) => {
		const formData = await request.formData();
		const targetId = formData.get('id');

		const { error } = await locals.supabase
			.from('profiles')
			.update({ role: 'anggota_biasa' })
			.eq('id', targetId);

		if (error) return fail(500, { error: 'Gagal menaikkan pangkat anggota.' });
	}
};
