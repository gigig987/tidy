<script lang="ts">
	import Message from '$ui/lib/components/Message.svelte';
	import MainAction from './furniture/MainAction.svelte';
</script>

<!-- example message. hook into the Message component to capture events + data -->
<Message
	on:init={(e) => {
		console.log('Plugin initialized!');
	}}
/>
<svelte:head>
	<title>Tidy figma plugin</title>
</svelte:head>

<main>
	<h1>Tidy</h1>
	<MainAction />
</main>
<style>
</style>
