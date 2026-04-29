import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { data: events } = await locals.supabase.from('events').select('*').eq('is_closed', false).limit(3);
    
    const { data: myEvents } = await locals.supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', locals.session?.user.id);

    return { 
        upcomingEvents: events ?? [],
        myRegisteredIds: myEvents?.map(e => e.event_id) ?? []
    };
};
