<script lang="ts">
	import {postMessage} from '$ui/lib/components/Message.svelte'
	import Message from '$ui/lib/components/Message.svelte';

	const tidy = () => {
		postMessage({
			type: 'tidy'
		})
	}
	const complete = () => {
		state = 'complete'
		setTimeout(() => {
			state = 'ready'
			}, 2000);
		}

	let state = 'ready'

</script>

<Message
	on:tidy-start={(e) => {
		state = 'tiding'
	}}
	on:tidy-complete={(e) => {
		console.log('tiding completed')
		complete()
	}}
/>

<div>
	<button on:click={tidy} disabled={state === 'tiding'}>
		{#if state === 'ready' || state === 'complete'}
		Tidy
		{:else if state === 'tiding'}
		Tiding..
		{/if}
	</button>
</div>
