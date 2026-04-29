<script lang="ts">
	let { data } = $props();

	// Gunakan $derived agar selalu update secara reaktif
	let profile = $derived(data.profile);
	let events = $derived(data.upcomingEvents);
	let myRegisteredIds = $derived(data.myRegisteredIds ?? []);
</script>

<div class="space-y-6">
	<div
		class="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm"
	>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">
				Halo, {profile?.full_name ?? data.session?.user?.user_metadata?.full_name ?? 'Kawan'}! 👋
			</h1>
			<p class="mt-2 text-gray-500">
				Selamat datang di Nexus, portal utama keanggotaan dan kegiatan.
			</p>
		</div>

		<div class="hidden md:block">
			{#if !profile || profile.role === 'guest'}
				<span
					class="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 font-semibold text-gray-600"
					>Tamu</span
				>
			{:else if profile.role === 'pending_approval'}
				<span
					class="rounded-lg border border-amber-200 bg-amber-100 px-4 py-2 font-semibold text-amber-700"
					>Menunggu Persetujuan</span
				>
			{:else if profile.role === 'pengurus'}
				<span
					class="rounded-lg border border-emerald-200 bg-emerald-100 px-4 py-2 font-semibold text-emerald-700"
					>Pengurus</span
				>
			{:else}
				<span
					class="rounded-lg border border-blue-200 bg-blue-100 px-4 py-2 font-semibold text-blue-700"
					>Anggota</span
				>
			{/if}
		</div>
	</div>

	{#if !profile || profile.role === 'guest'}
		<div class="rounded-r-xl border-l-4 border-amber-500 bg-amber-50 p-6">
			<h3 class="text-lg font-bold text-amber-800">Selamat Datang, Calon Anggota!</h3>
			<p class="mt-1 mb-4 text-amber-700">
				Akun Google kamu sudah terhubung. Sekarang, silakan lengkapi data mahasiswa kamu agar bisa
				bergabung dengan kegiatan UKM CE.
			</p>
			<a
				href="/join"
				class="inline-block rounded-lg bg-amber-500 px-6 py-2 font-semibold text-white transition hover:bg-amber-600"
			>
				Lengkapi Data & Daftar
			</a>
		</div>
	{:else if profile.role === 'pending_approval'}
		<div class="rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-6">
			<h3 class="text-lg font-bold text-blue-800">Sedang Diverifikasi ⏳</h3>
			<p class="mt-1 text-blue-700">
				Sabar ya! Pengurus sedang mengecek data kamu. Kami akan segera mengaktifkan fitur penuh
				setelah akunmu disetujui.
			</p>
		</div>
	{:else}
		<div class="mb-4">
			<h2 class="flex items-end justify-between text-xl font-bold text-gray-800">
				Kegiatan Terdekat
				<a href="/events" class="text-sm font-medium text-emerald-600 hover:underline"
					>Lihat Semua &rarr;</a
				>
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each events as acara}
				{@const isRegistered = myRegisteredIds.includes(acara.id)}

				<div
					class="relative flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-md"
				>
					<div class="mb-4 flex items-start justify-between">
						<span
							class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase"
						>
							{acara.tipe_kegiatan.replace('_', ' ')}
						</span>

						{#if isRegistered}
							<span
								class="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600 uppercase"
								>Terdaftar</span
							>
						{/if}
					</div>

					<h3 class="mb-2 text-xl leading-tight font-bold text-gray-900">{acara.title}</h3>

					<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path></svg
						>
						{new Date(acara.date_time).toLocaleDateString('id-ID', {
							weekday: 'short',
							day: 'numeric',
							month: 'short'
						})}
					</div>

					<p class="mb-6 line-clamp-2 flex-grow text-sm text-gray-600">{acara.description}</p>

					<a
						href="/events/{acara.id}"
						class="block w-full rounded-xl py-2.5 text-center font-bold transition
            {isRegistered
							? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'}"
					>
						{isRegistered ? 'Lihat Detail' : 'Daftar Sekarang'}
					</a>
				</div>
			{:else}
				<div
					class="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500"
				>
					Belum ada jadwal kegiatan mendatang.
				</div>
			{/each}
		</div>
	{/if}
</div>
