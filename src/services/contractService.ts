import { ethers } from 'ethers';

export const AGRI_TRACELINK_ABI = [
  "function createBatch(string memory _cropName, string memory _location, uint256 _quantity, string memory _ipfsHash) external returns (uint256)",
  "function submitQualityReport(uint256 _batchId, bool _passed, string memory _reportIpfsHash, string memory _notes) external",
  "function transferCustody(uint256 _batchId, address _nextHandler, string memory _newLocation, int16 _temp, uint8 _humidity) external",
  "function markDelivered(uint256 _batchId) external",
  "function recallBatch(uint256 _batchId, string memory _reason) external",
  "function getBatchDetails(uint256 _batchId) external view returns (tuple(uint256 batchId, string cropOrHerbName, address farmerAddress, uint256 harvestTimestamp, string farmLocationLatLong, uint256 quantityKg, string ipfsMetadataHash, address currentOwner, uint8 status, bool qualityApproved) batch, tuple(address testerAddress, uint256 testedAt, bool passed, string reportIpfsHash, string notes)[] reports, tuple(address handlerAddress, string locationName, uint256 timestamp, int16 tempCelsius, uint8 humidityPercent)[] checkpoints)",
  "function verifyBatchAuthenticity(uint256 _batchId) external view returns (uint8 status, address currentOwner, bool isAuthentic, bool qualityPassed)",
  "function getBatchCount() external view returns (uint256)",
  "function grantRole(bytes32 role, address account) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "event BatchCreated(uint256 indexed batchId, string cropName, address indexed farmer, uint256 harvestTimestamp, uint256 quantityKg)",
  "event StatusUpdated(uint256 indexed batchId, uint8 indexed newStatus, address indexed updatedBy)",
  "event QualityLogged(uint256 indexed batchId, address indexed tester, bool passed, string reportIpfsHash)",
  "event CustodyTransferred(uint256 indexed batchId, address indexed previousOwner, address indexed newOwner, string locationName)"
];

export const CONTRACT_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

export class AgriTraceContractService {
  private static instance: AgriTraceContractService;

  private constructor() {}

  public static getInstance(): AgriTraceContractService {
    if (!AgriTraceContractService.instance) {
      AgriTraceContractService.instance = new AgriTraceContractService();
    }
    return AgriTraceContractService.instance;
  }

  public getContract(signerOrProvider: any) {
    return new ethers.Contract(CONTRACT_ADDRESS, AGRI_TRACELINK_ABI, signerOrProvider);
  }
}

export const agriContractService = AgriTraceContractService.getInstance();
