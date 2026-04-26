<script lang="ts">
	import '../app.css';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

    let { children } = $props()

	let session: any = $state(null);

	onMount(async () => {
		const { data } = await supabase.auth.getSession();

		session = data.session;

		supabase.auth.onAuthStateChange((_event, _session) => {
			session = _session;
		});
	});
</script>

{@render children()}
