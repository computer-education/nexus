<script>
    const { children } = $props()
</script>

<div class="flex min-h-screen flex-col bg-slate-50 font-sans">
	<main class="mx-auto w-full max-w-7xl flex-grow">
        {@render children()}
	</main>
</div>
