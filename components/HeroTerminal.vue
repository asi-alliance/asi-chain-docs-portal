<template>
    <figure class="asi-term" aria-label="Example: checking a single-node private shard with curl">
        <div class="asi-term-bar" aria-hidden="true">
            <i></i><i></i><i></i>
            <span>single-node private shard</span>
        </div>
<!-- Command and answer are copied from nodes/private-shard/ (section "Start a Single-Node Shard": the curl command in the paragraph before the text block, and the text block itself). <wbr> after each comma lets the JSON wrap between fields instead of inside a name. -->
        <pre tabindex="0"><code><span class="asi-term-p">$</span> curl -s http://localhost:40403/api/status
<span class="asi-term-out">"networkId":"my-shard-net",<wbr>"shardId":"my-shard",<wbr>"nativeTokenSymbol":"ASI",<wbr>"nativeTokenDecimals":8,<wbr>"isValidator":true,<wbr>"isReady":true,<wbr>"lastFinalizedBlockNumber":1</span></code></pre>
    </figure>
</template>
