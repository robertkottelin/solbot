"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Initialize dotenv
dotenv_1.default.config();
// Parse the private key from the environment variable
const secretKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || '');
const wallet = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(secretKey));
// Initialize a connection to the Solana network
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'));
// Function to get SOL price from Aldrin
function getSOLPriceFromAldrin() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://api.aldrin.com/v1/sol-price'; // Example endpoint
        try {
            const response = yield axios_1.default.get(url);
            return response.data.price; // Adjust based on the actual response structure
        }
        catch (error) {
            console.error('Error fetching SOL price from Aldrin:', error);
            throw error; // Or handle error as needed
        }
    });
}
// Function to get SOL price from Orca
function getSOLPriceFromOrca() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://api.orca.so/v1/sol-price'; // Example endpoint
        try {
            const response = yield axios_1.default.get(url);
            return response.data.price; // Adjust based on the actual response structure
        }
        catch (error) {
            console.error('Error fetching SOL price from Orca:', error);
            throw error; // Or handle error as needed
        }
    });
}
// Function to perform arbitrage
function performArbitrage() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            // Here you can use 'wallet' to sign transactions and perform actions
            const priceAldrin = yield getSOLPriceFromAldrin();
            const priceOrca = yield getSOLPriceFromOrca();
            // Define what a "significant" price difference is
            const significantDifference = 2; // Example value in percentage
            if (Math.abs(priceAldrin - priceOrca) / priceAldrin * 100 > significantDifference) {
                if (priceAldrin < priceOrca) {
                    console.log('Buy on Aldrin, Sell on Orca');
                    // Implement buy on Aldrin and sell on Orca using wallet
                }
                else {
                    console.log('Buy on Orca, Sell on Aldrin');
                    // Implement buy on Orca and sell on Aldrin using wallet
                }
            }
            else {
                console.log('No significant price difference found.');
            }
            // Wait for some time before checking again
            yield new Promise(resolve => setTimeout(resolve, 10000)); // Example: 10 seconds
        }
    });
}
// Start arbitrage
performArbitrage().catch(console.error);
