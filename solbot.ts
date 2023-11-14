import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";

import { AldrinApiPoolsClient } from "@aldrin-exchange/sdk";

import Decimal from "decimal.js";
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Parse the private key from the environment variable
const secretKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || '');
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Initialize a connection to the Solana network
const connection = new Connection(clusterApiUrl('devnet'));

async function getTotalVolumeLocked() {
    const client = new AldrinApiPoolsClient()
  
    const tvl = await client.getTotalVolumeLocked()
    console.log('TVL: ', tvl)
  
    const poolsInfo = await client.getPoolsInfo()
  
    console.log('poolsInfo: ', poolsInfo)
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
getTotalVolumeLocked().catch(console.error);