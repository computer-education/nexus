import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (!error) {
			throw redirect(303, '/');
		} else {
			console.error("❌ Gagal tukar kode OAuth:", error);
		}
	}

	throw redirect(303, '/login');
};
