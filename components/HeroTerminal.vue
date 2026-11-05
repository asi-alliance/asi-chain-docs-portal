<template>
    <figure class="asi-term" aria-label="Example: checking a node with curl">
        <div class="asi-term-bar" aria-hidden="true">
            <i></i><i></i><i></i>
            <span>terminal</span>
        </div>
<!-- Command and answer are copied from shard-nodes/own-shard/ (section "Single-Node Shard": the curl command in the paragraph before the text block, and the text block itself). -->
        <pre tabindex="0"><code><span class="asi-term-p">$</span> curl -s http://localhost:40403/api/status
<span class="asi-term-out">"networkId":"my-shard-net","shardId":"my-shard","nativeTokenSymbol":"ASI","nativeTokenDecimals":8,"isValidator":true,"isReady":true,"lastFinalizedBlockNumber":1</span></code></pre>
    </figure>
</template>
