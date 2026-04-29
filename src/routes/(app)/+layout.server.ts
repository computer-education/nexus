import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = locals.session;

    if (!session) return { profile: null };

    const { data: profile } = await locals.supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    return {
        session,
        profile
    }
};
