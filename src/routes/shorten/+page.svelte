<script>
	import '@picocss/pico';
	import InputForm from '../components/InputForm.svelte';
</script>

<section>
	<p>Enter long URL</p>
	<InputForm />
</section>

<style lang="scss">
  section {
		display: flex;
		flex-direction: column;
		flex: 0.8;
	}
  
  p {
    text-align: center;
  }
</style>