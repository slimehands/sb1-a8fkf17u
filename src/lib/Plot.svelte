<script lang="ts">
import { db } from './db'
import { liveQuery } from "dexie";
$: results = liveQuery(async () => {
    //
    // Query Dexie's API
    //
    const res = await db
      .toArray();

    // Return result
    return res;
  });
</script>

<ul>
  {#if $results}
  yay
    {#each $results as result (result.id)}
      <li>{result.id}, {friend.data}</li>
    {/each}
  {/if}
</ul>
//issues