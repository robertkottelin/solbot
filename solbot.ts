import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { Orca, getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";

import { AldrinApiPoolsClient } from '@aldrin_exchange/sdk';

import Decimal from "decimal.js";
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Parse the private key from the environment variable
// const secretKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || '');
// const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Initialize a connection to the Solana network
const connection = new Connection(clusterApiUrl('devnet'));

// write a function to test the https://api.orca.so endpoint and log the response
async function testOrca() {
    const orca = await getOrca(connection);
    const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
    const solToken = orcaSolPool.getTokenB();
    const solAmount = new Decimal(0.1);
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    const orcaAmount = quote.getMinOutputAmount();
    console.log(orcaAmount);
    return solToken;
}

// Function to get SOL price from Aldrin
async function getSOLPriceFromAldrin() {
    const url = 'https://api.aldrin.com/v1/sol-price'; // Example endpoint
    try {
        const response = await axios.get(url);
        return response.data.price; // Adjust based on the actual response structure
    } catch (error) {
        console.error('Error fetching SOL price from Aldrin:', error);
        throw error; // Or handle error as needed
    }
}

// Function to get SOL price from Orca
async function getSOLPriceFromOrca() {
    const url = 'https://api.orca.so/v1/sol-price'; // Example endpoint
    try {
        const response = await axios.get(url);
        return response.data.price; // Adjust based on the actual response structure
    } catch (error) {
        console.error('Error fetching SOL price from Orca:', error);
        throw error; // Or handle error as needed
    }
}

// Function to perform arbitrage
async function performArbitrage() {
    while (true) {
        // Here you can use 'wallet' to sign transactions and perform actions
        const priceAldrin = await getSOLPriceFromAldrin();
        const priceOrca = await getSOLPriceFromOrca();

        // Define what a "significant" price difference is
        const significantDifference = 2; // Example value in percentage

        if (Math.abs(priceAldrin - priceOrca) / priceAldrin * 100 > significantDifference) {
            if (priceAldrin < priceOrca) {
                console.log('Buy on Aldrin, Sell on Orca');
                // Implement buy on Aldrin and sell on Orca using wallet
            } else {
                console.log('Buy on Orca, Sell on Aldrin');
                // Implement buy on Orca and sell on Aldrin using wallet
            }
        } else {
            console.log('No significant price difference found.');
        }

        // Wait for some time before checking again
        await new Promise(resolve => setTimeout(resolve, 10000)); // Example: 10 seconds
    }
}

// Start arbitrage
// performArbitrage().catch(console.error);
testOrca().catch(console.error);