<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let longUrl = '';
  let shortUrl = '';
  let errorMessage = '';
  let isSubmitting = false;
  const dispatch = createEventDispatcher();

  const handleSubmit = async () => {
    isSubmitting = true;
    errorMessage = '';
    try {
      const response = await fetch('/api/kv/shorten', {
        method: 'POST',
        body: JSON.stringify({ url: longUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      const data = await response.json();
      shortUrl = data.shortUrl;
      dispatch('urlShortened', shortUrl);
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isSubmitting = false;
    }/* The `put` method is used to store data in a key-value store. In this specific code
    snippet, the `put` method is being used to store the `urlData` object in a key-value
    namespace (`kv`) with the key being generated using `uuidv4()`. The data is being
    stored as a JSON string after stringifying the `urlData` object. */
    
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="url" bind:value={longUrl} required />
  <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
  {#if shortUrl}
    <p>Short URL: {shortUrl}</p>
  {/if}
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</form>
