<script lang="ts">
  import '@picocss/pico';
</script>

<header class="container-fluid">
  <nav class="row">
    <h1>Awesome URL Shortener</h1>
    <ul>
      <li><a href="/shortener">Shorten!</a></li>
      <li><a href="/" class="secondary">About</a></li>
    </ul>
  </nav>
</header>

<main class="container">
  <section>
    <slot></slot>
  </section>
</main>

<footer class="container">
  <div class="row align-items-end">
    <div class="col">
      &nbsp;&copy;2024 Lehcode
    </div>
  </div>
</footer>
