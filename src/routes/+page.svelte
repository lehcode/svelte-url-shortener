<script>
	import '@picocss/pico';
	import InputForm from './components/InputForm.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Demo URL shortener app" />
</svelte:head>

<section>
	<p>Enter long URL:</p>
	<InputForm />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
