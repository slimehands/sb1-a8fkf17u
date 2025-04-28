<script lang="ts">
	let lines: Array<String> = [];
	import { streamStore } from './lib/streamStore';
	import { onDestroy } from 'svelte';
	import { parse } from './lib/parser';
	import { singleAdd } from './lib/singleadd'
	import { db, base } from './lib/db';
	import "dexie-export-import";
	import Plot from './lib/Plot.svelte'
	
	//import { tables } from '$lib/tables';
	let unsubscribe: any = null;
	async function importBackup(event:Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		await base.import(file)
	}
	async function exportBackup(){
		const file = await base.export();
		var a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = "export.json";
        document.body.appendChild(a);
        a.click();
	}
	async function handleFile(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Clean up old stream
		if (unsubscribe) unsubscribe();

		const stream = file.stream();
		const lineStream = streamStore(stream);

		unsubscribe = lineStream.subscribe(async (line) => {
			if (line !== undefined) {
				lines = [...lines, line];
				
				
				await singleAdd(line);
			}
		});
	}

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script> 

<div class="file-reader">
	
	<label> <input type="file" on:change={handleFile} /> import file direct from sd</label>
	
	<label> <input type="file" on:change={importBackup}/> import backup file</label>

	<button on:click={exportBackup}> to download a backup</button>

	<h3>File Contents:</h3>
	<ul>
		{#each lines as line}
			<div class="file-reader">{line}</div>
		{/each}
	</ul>

</div>
<Plot/>

<style>
	.file-reader {
		padding: 1rem;
		border: 1px solid #ccc;
		max-width: 600px;
		margin: auto;
	}
	ul {
		max-height: 300px;
		overflow-y: auto;
		padding: 0;
	}
</style>