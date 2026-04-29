<script lang="ts">
	let { data } = $props();

	const formatTanggal = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const isPast = (dateStr: string) => {
		return new Date(dateStr) < new Date();
	};
</script>

<div class="space-y-8">
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Agenda Kegiatan</h1>
			<p class="text-gray-500">Daftar kajian, pelatihan, dan rapat internal UKM CE.</p>
		</div>

		{#if data.userRole === 'pengurus'}
			<a href="/admin/events" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm flex items-center gap-2">
				<span class="text-lg">+</span> Buat Acara Baru
			</a>
		{/if}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.events as event}
			<div class="bg-white border {isPast(event.date_time) ? 'border-gray-200 opacity-75' : 'border-emerald-100 shadow-sm'} rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition">
				
				<div class="flex justify-between items-start mb-4">
					<span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
						{event.tipe_kegiatan === 'kajian' ? 'bg-blue-100 text-blue-700' : 
						 event.tipe_kegiatan === 'pelatihan' ? 'bg-purple-100 text-purple-700' : 
						 'bg-amber-100 text-amber-700'}">
						{event.tipe_kegiatan.replace('_', ' ')}
					</span>
					
					{#if isPast(event.date_time)}
						<span class="text-[10px] font-bold text-gray-400 uppercase">Selesai</span>
					{:else}
						<span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
					{/if}
				</div>

				<h3 class="text-xl font-bold text-gray-900 mb-2 leading-tight">
					{event.title}
				</h3>

				<div class="text-sm text-gray-500 mb-4 flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
					{formatTanggal(event.date_time)}
				</div>

				<p class="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
					{event.description || 'Tidak ada deskripsi tambahan.'}
				</p>

				<a href="/events/{event.id}" 
					class="w-full text-center py-2.5 rounded-xl font-bold transition
					{isPast(event.date_time) ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}">
					{isPast(event.date_time) ? 'Lihat Dokumentasi' : 'Daftar / Detail'}
				</a>
			</div>
		{:else}
			<div class="col-span-full py-20 text-center">
				<div class="text-5xl mb-4 text-gray-300">📅</div>
				<h3 class="text-lg font-medium text-gray-900">Belum ada agenda</h3>
				<p class="text-gray-500">Cek kembali nanti untuk jadwal kegiatan terbaru.</p>
			</div>
		{/each}
	</div>
</div>
