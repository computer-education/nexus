<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
	<div class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
		<h2 class="mb-2 text-2xl font-bold text-gray-900">Lengkapi Profil</h2>
		<p class="mb-6 text-sm text-gray-500">
			Satu langkah lagi untuk bergabung menjadi bagian dari UKM Computer Education.
		</p>

		{#if form?.error}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="nim" class="block text-sm font-medium text-gray-700">NIM</label>
				<input
					type="text"
					id="nim"
					name="nim"
					required
					class="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-colors focus:border-emerald-500 focus:ring-emerald-500"
					placeholder="Contoh: 2023081..."
				/>
			</div>

			<div>
				<label for="prodi" class="block text-sm font-medium text-gray-700">Program Studi</label>
				<select
					id="prodi"
					name="prodi"
					required
					class="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-colors focus:border-emerald-500 focus:ring-emerald-500"
				>
					<option value="" disabled selected>Pilih Program Studi</option>
					<option value="Teknik Informatika">Teknik Informatika</option>
					<option value="Sistem Informasi">Sistem Informasi</option>
					<option value="Ilmu Komputer">Ilmu Komputer</option>
					<option value="Lainnya">Lainnya</option>
				</select>
			</div>

			<div>
				<label for="whatsapp" class="block text-sm font-medium text-gray-700">No. WhatsApp</label>
				<input
					type="tel"
					id="whatsapp"
					name="whatsapp"
					required
					class="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-colors focus:border-emerald-500 focus:ring-emerald-500"
					placeholder="Contoh: 08123456789"
				/>
			</div>

			<button
				type="submit"
				class="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition-all hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200"
			>
				Kirim Pendaftaran
			</button>
		</form>
	</div>
</div>
