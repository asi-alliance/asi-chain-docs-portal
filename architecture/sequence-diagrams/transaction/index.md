# Transaction Flow

Complete sequence from user initiating a transfer to confirmation.

← [Back to Sequence Diagrams](../)

## Overview

A token transfer goes through three main phases:

1. **Preparation** - User input and signing
2. **Submission** - Send to validator
3. **Confirmation** - Block inclusion and verification

## Phase 1: Preparation

```mermaid
sequenceDiagram
    participant U as User
    participant W as Wallet
    participant Store as Redux Store
    
    U->>W: Enter recipient & amount
    W->>U: Request password
    U->>W: Provide password
    
    W->>Store: Get account
    Store-->>W: Account details
    
    W->>W: Decrypt private key
    W->>W: Generate Rholang code
    W->>W: Sign deploy
```

| Step | Description |
|------|-------------|
| User input | Enter recipient address and amount |
| Password | Unlock account |
| Sign | Create signed deploy |

## Phase 2: Submission

```mermaid
sequenceDiagram
    participant W as Wallet
    participant AS as ASI Service
    participant VN as Validator Node
    
    W->>AS: Submit transaction
    AS->>VN: POST /api/deploy
    VN->>VN: Validate deploy
    VN->>VN: Add to mempool
    VN-->>AS: Deploy ID
    AS-->>W: Transaction pending
```

| Step | Description |
|------|-------------|
| Submit | Send to validator |
| Validate | Check signature and syntax |
| Mempool | Queue for block inclusion |

## Phase 3: Confirmation

```mermaid
sequenceDiagram
    participant W as Wallet
    participant RN as Read-Only Node
    participant BC as Blockchain
    
    Note over BC: Block creation
    
    W->>RN: Check deploy status
    RN->>BC: Query deploy
    BC-->>RN: Deploy result
    RN-->>W: Transaction confirmed
    
    W->>W: Update UI
```

| Step | Description |
|------|-------------|
| Block creation | Wait for next block |
| Confirmation | Verify result |

---

## Related Documentation

- [Wallet Architecture](../../component-diagrams/wallet/) - Wallet internals
- [Balance Query](../balance/) - How balance checks work
- [Send Tokens Guide](/wallet/usage/) - Step-by-step guide
