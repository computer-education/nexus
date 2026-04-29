<script lang="ts">
	import '../../app.css';
	import Header from '../Header.svelte';
	import Footer from '../Footer.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-slate-50 font-sans">
	<Header session={data.session} role={data.profile.role} />
	<main class="mx-auto w-full max-w-7xl flex-grow p-6">
		{@render children()}
	</main>
	<Footer />
</div>
