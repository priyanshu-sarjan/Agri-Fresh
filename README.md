# 🌱 Agri-Fresh & TraceLink / AyuTrace — Web3 Botanical & Agricultural Supply Chain Protocol

**Agri-Fresh** is a production-grade, gas-optimized Web3 botanical and agricultural supply chain tracker built in **Solidity (^0.8.20)** using OpenZeppelin `AccessControl` and QR code batch passport technology.

---

## 🌟 Smart Contract Architecture (`contracts/AgriTraceLink.sol`)

The `AgriTraceLink.sol` smart contract provides tamper-evident harvest tracking, lab quality inspection logging, custody transit updates with environmental telemetry (temperature & humidity), and emergency batch recalls.

### 🔐 Role Authorization Matrix (OpenZeppelin AccessControl)

| Role | Role Constant | Key Capabilities |
| :--- | :--- | :--- |
| **Admin** | `DEFAULT_ADMIN_ROLE` | Assign/revoke roles, execute emergency batch recalls. |
| **Farmer** | `FARMER_ROLE` | Register new herb/crop batches (`createBatch`). |
| **Quality Tester** | `QUALITY_TESTER_ROLE` | Approve/reject quality tests & upload IPFS lab report hashes (`submitQualityReport`). |
| **Distributor / Logistics** | `DISTRIBUTOR_ROLE` / `LOGISTICS_ROLE` | Update physical custody, location, temperature, & humidity logs (`transferCustody`). |
| **Retailer** | `RETAILER_ROLE` | Mark product received and ready for point-of-sale (`markDelivered`). |

---

## 📜 Contract Data Structures & Functions

### Data Structures
```solidity
enum BatchStatus { Harvested, Tested, InTransit, Distributed, Delivered, Recalled }

struct QualityReport {
    address testerAddress;
    uint256 testedAt;
    bool passed;
    string reportIpfsHash;
    string notes;
}

struct TransitCheckpoint {
    address handlerAddress;
    string locationName;
    uint256 timestamp;
    int16 tempCelsius;
    uint8 humidityPercent;
}

struct Batch {
    uint256 batchId;
    string cropOrHerbName;
    address farmerAddress;
    uint256 harvestTimestamp;
    string farmLocationLatLong;
    uint256 quantityKg;
    string ipfsMetadataHash;
    address currentOwner;
    BatchStatus status;
    bool qualityApproved;
}
```

### Core Functions
1. `createBatch(string _cropName, string _location, uint256 _quantity, string _ipfsHash)`
2. `submitQualityReport(uint256 _batchId, bool _passed, string _reportIpfsHash, string _notes)`
3. `transferCustody(uint256 _batchId, address _nextHandler, string _newLocation, int16 _temp, uint8 _humidity)`
4. `getBatchDetails(uint256 _batchId)` (Public view returning Batch, QualityReports[], and TransitCheckpoints[])
5. `verifyBatchAuthenticity(uint256 _batchId)` (Public view returning status, owner, isAuthentic, and qualityPassed)

---

## ⚡ Gas Optimizations & Security
- **Custom Errors**: Replaces string reverts with custom errors (`error UnauthorizedRole()`, `error BatchNotFound()`, etc.), reducing deployment & execution gas by ~20%.
- **Indexed Event Emission**: Emits `BatchCreated`, `StatusUpdated`, `QualityLogged`, `CustodyTransferred`, and `BatchRecalled` for efficient off-chain event indexing.
- **Reentrancy & Zero-Address Checks**: Validates parameters against zero-addresses and state mutability hazards.

---

## 📱 QR Code Passport Generation Technology

Integrates dynamic QR code generation from **AYUTRACE / TraceLink**:
- Each agricultural batch gets a printable SVG/PNG QR passport.
- Scanning the QR code retrieves `batchId`, contract verification address, IPFS lab report metadata hash, and instant authenticity status.

---

## 🛠️ Deployment Instructions

### Deploy Contract using Hardhat / Ethers
```bash
npx hardhat run scripts/deploy-solidity.js --network sepolia
```

---

## 🏅 Connected Repositories

- **Agri-Fresh Repository**: [https://github.com/priyanshu-sarjan/Agri-Fresh](https://github.com/priyanshu-sarjan/Agri-Fresh)
- **AyuTrace Repository**: [https://github.com/priyanshu-sarjan/AYUTRACE](https://github.com/priyanshu-sarjan/AYUTRACE)
- **TraceLink Repository**: [https://github.com/priyanshu-sarjan/TraceLink](https://github.com/priyanshu-sarjan/TraceLink)
