<script lang="ts">
	import '../../app.css';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
    import Header from '../Header.svelte';
    import Footer from '../Footer.svelte';

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

<div class="flex min-h-screen flex-col bg-slate-50 font-sans">
    <Header {session}/>
	<main class="mx-auto w-full max-w-7xl flex-grow p-6">
        {@render children()}
	</main>
    <Footer/>
</div>
