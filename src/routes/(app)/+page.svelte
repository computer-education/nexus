<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user = $state<any>(null);
	let profile = $state<any>(null);
	let events = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const {
			data: { user: authUser }
		} = await supabase.auth.getUser();

		if (!authUser) {
			goto('/login');
			return;
		}
		user = authUser;

		// Ambil profil
		const { data: profileData } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();
		profile = profileData;

		// Ambil daftar event kajian yang akan datang
		const { data: eventData } = await supabase
			.from('events')
			.select('*')
			.order('date_time', { ascending: true }); // Urutkan dari yang terdekat

		if (eventData) events = eventData;
		loading = false;
	});

	const daftarAcara = async (eventId: string) => {
		// Insert ke tabel event_registrations
		const { error } = await supabase.from('event_registrations').insert({
			event_id: eventId,
			user_id: user.id
		});

		if (error) {
			// Karena kita pakai constraint UNIQUE di database, kalau error biasanya karena udah daftar
			if (error.code === '23505') {
				alert('Kamu sudah terdaftar di acara ini!');
			} else {
				alert('Gagal mendaftar: ' + error.message);
			}
		} else {
			alert('Berhasil mendaftar! Jangan lupa hadir ya.');
		}
	};
</script>

{#if !loading}
	<div class="mt-10">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-2xl font-bold text-gray-800">Kajian & Kegiatan Mendatang</h2>
			{#if profile?.role === 'pengurus'}
				<a
					href="/admin/buat-acara"
					class="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-200"
				>
					+ Buat Acara
				</a>
			{/if}
		</div>

		{#if events.length === 0}
			<div
				class="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm"
			>
				Belum ada jadwal kajian dalam waktu dekat.
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each events as event}
					<div class="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
						<div class="mb-4 flex items-start justify-between">
							<h3 class="text-lg font-bold text-gray-800">{event.title}</h3>
							{#if event.is_public}
								<span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"
									>Umum</span
								>
							{:else}
								<span
									class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"
									>Internal CE</span
								>
							{/if}
						</div>

						<p class="mb-4 flex-grow text-sm text-gray-600">{event.description}</p>

						<div
							class="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-500"
						>
							📅 {new Date(event.date_time).toLocaleDateString('id-ID', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}<br />
							⏰ {new Date(event.date_time).toLocaleTimeString('id-ID', {
								hour: '2-digit',
								minute: '2-digit'
							})} WIB
						</div>

						{#if profile?.role !== 'guest' || event.is_public}
							<button
								onclick={() => daftarAcara(event.id)}
								class="w-full rounded-lg bg-gray-900 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
							>
								Daftar Sekarang
							</button>
						{:else}
							<div class="rounded-lg bg-red-50 p-2 text-center text-sm font-medium text-red-500">
								Hanya Anggota Resmi
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
