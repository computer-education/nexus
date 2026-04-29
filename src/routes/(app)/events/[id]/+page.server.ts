import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = locals.session;
	if (!session) throw redirect(303, '/login');

	const eventId = params.id;

	const { data: event, error: errEvent } = await locals.supabase
		.from('events')
		.select('*')
		.eq('id', eventId)
		.single();

	if (errEvent || !event) {
		throw error(404, 'Acara tidak ditemukan atau sudah dihapus.');
	}

	const { data: myProfile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	const userRole = myProfile?.role ?? 'guest';

	const { data: registration } = await locals.supabase
		.from('event_registrations')
		.select('id')
		.eq('event_id', eventId)
		.eq('user_id', session.user.id)
		.single();

	let participants: any[] = [];

	if (userRole === 'pengurus') {
		const { data: regs } = await locals.supabase
			.from('event_registrations')
			.select(`
				id,
				is_attended,
				created_at,
				profiles (
					full_name,
					nim,
					prodi
				)
			`)
			.eq('event_id', eventId)
			.order('created_at', { ascending: true });
		
		participants = regs ?? [];
	}

	return {
		event,
		isRegistered: !!registration,
		userRole,
		participants
	};
};

export const actions: Actions = {
    daftar: async ({ params, locals }) => {
        const session = locals.session;
        if (!session) throw redirect(303, '/login');

        const { data: event } = await locals.supabase.from('events').select('is_closed').eq('id', params.id).single();
        if (event?.is_closed) return fail(400, { message: 'Pendaftaran sudah ditutup!' });

        const { error } = await locals.supabase.from('event_registrations').insert({
            event_id: params.id,
            user_id: session.user.id
        });
        if (error) return fail(500, { message: 'Gagal mendaftar.' });
    },
	
	batal: async ({ params, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(303, '/login');

		const { error } = await locals.supabase
			.from('event_registrations')
			.delete()
			.eq('event_id', params.id)
			.eq('user_id', session.user.id);

		if (error) return fail(500, { message: `Gagal membatalkan pendaftaran.` }); 
	},


    toggleAbsen: async ({ request, locals, params }) => {
        const session = locals.session;
        const { data: profile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role !== 'pengurus') return fail(403, { message: 'Akses ditolak.' });

        const { data: event } = await locals.supabase.from('events').select('is_closed').eq('id', params.id).single();
        if (event?.is_closed) return fail(400, { message: 'Acara sudah selesai, data tidak bisa diubah.' });

        const formData = await request.formData();
        const regId = formData.get('registration_id');
        const targetUserId = formData.get('user_id');
        const currentStatus = formData.get('current_status') === 'true';

        //  FIX: Jangan biarkan pengurus absen diri sendiri
        if (session.user.id === targetUserId) {
            return fail(400, { message: 'Minta tolong pengurus lain untuk absen kamu ya!' });
        }

        await locals.supabase.from('event_registrations').update({ is_attended: !currentStatus }).eq('id', regId);
    },

    tutupAcara: async ({ params, locals }) => {
        const session = locals.session;
        const { data: profile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single();
        
        if (profile?.role === 'pengurus') {
            await locals.supabase.from('events').update({ is_closed: true }).eq('id', params.id);
        }
    }
};
