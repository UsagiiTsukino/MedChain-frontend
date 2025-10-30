import Web3 from 'web3';

// Initialize Web3 with your provider
const web3 = new Web3(window.ethereum || "http://localhost:7545");

// Function to get latest block number
export const getLatestBlockNumber = async () => {
    try {
        return await web3.eth.getBlockNumber();
    } catch (error) {
        console.error("Error getting latest block number:", error);
        throw error;
    }
};

// Function to get block details by block number
export const getBlockByNumber = async (blockNumber) => {
    try {
        return await web3.eth.getBlock(blockNumber, true);
    } catch (error) {
        console.error("Error getting block details:", error);
        throw error;
    }
};

// Function to get transaction details by hash
export const getTransactionByHash = async (txHash) => {
    try {
        return await web3.eth.getTransaction(txHash);
    } catch (error) {
        console.error("Error getting transaction details:", error);
        throw error;
    }
};

// Function to get transaction receipt
export const getTransactionReceipt = async (txHash) => {
    try {
        return await web3.eth.getTransactionReceipt(txHash);
    } catch (error) {
        console.error("Error getting transaction receipt:", error);
        throw error;
    }
};

// Function to get all transactions from latest blocks
export const getLatestTransactions = async (numberOfBlocks = 10) => {
    try {
        const latestBlock = await getLatestBlockNumber();
        const transactions = [];

        for (let i = 0; i < numberOfBlocks; i++) {
            const blockNumber = latestBlock - i;
            if (blockNumber < 0) break;

            const block = await getBlockByNumber(blockNumber);
            if (block && block.transactions) {
                transactions.push(...block.transactions);
            }
        }

        return transactions;
    } catch (error) {
        console.error("Error getting latest transactions:", error);
        throw error;
    }
};

// Function to get account balance in ETH
export const getAccountBalanceInEth = async (address) => {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEth;
    } catch (error) {
        console.error("Error getting account balance:", error);
        throw error;
    }
};

// Function to get account balance in Wei
export const getAccountBalanceInWei = async (address) => {
    try {
        return await web3.eth.getBalance(address);
    } catch (error) {
        console.error("Error getting account balance in Wei:", error);
        throw error;
    }
};

// Function to format balance
export const formatBalance = (balance, decimals = 4) => {
    try {
        return Number(balance).toFixed(decimals);
    } catch (error) {
        console.error("Error formatting balance:", error);
        return '0';
    }
};

// Function to get transaction count for an address
export const getTransactionCount = async (address) => {
    try {
        return await web3.eth.getTransactionCount(address);
    } catch (error) {
        console.error("Error getting transaction count:", error);
        throw error;
    }
};

// Function to get pending transactions
export const getPendingTransactions = async () => {
    try {
        const pendingBlock = await web3.eth.getBlock('pending', true);
        return pendingBlock.transactions || [];
    } catch (error) {
        console.error("Error getting pending transactions:", error);
        throw error;
    }
};

// Function to subscribe to new transactions
export const subscribeToNewTransactions = (callback) => {
    try {
        return web3.eth.subscribe('pendingTransactions', (error, result) => {
            if (error) {
                console.error("Error in transaction subscription:", error);
                return;
            }
            callback(result);
        });
    } catch (error) {
        console.error("Error setting up transaction subscription:", error);
        throw error;
    }
}; 
