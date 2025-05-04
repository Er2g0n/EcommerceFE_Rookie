import { ResultService } from "../../../types/Base/ResultService";
import { Price } from "../../../types/ProductManagement/Price/Price";
import { PRICE_API_URL } from "../../apiConfig"; // Đã định nghĩa trong apiConfig.ts

// Fetch the latest price by product code
export async function getPriceByProductCode(productCode: string): Promise<ResultService<Price>> {
  try {
    const response = await fetch(`${PRICE_API_URL}/GetByProductCode/${encodeURIComponent(productCode)}?latest=true`);
    if (!response.ok) {
      throw new Error(`Error fetching price for product code ${productCode}`);
    }
    const result = await response.json();
    console.log(`Fetched latest price for product ${productCode}:`, result);
    return result;
  } catch (error) {
    console.error(`Error in getPriceByProductCode for ${productCode}:`, error);
    return {
      code: "999",
      message: error instanceof Error ? error.message : "Unknown error fetching price",
      data: null,
    };
  }
}

export async function getLatestPriceByProductCode(productCode: string): Promise<ResultService<Price>> {
  try {
    const response = await fetch(`${PRICE_API_URL}/GetLatestPriceByProductCode/${encodeURIComponent(productCode)}`);
    if (!response.ok) {
      throw new Error(`Error fetching latest price for product code ${productCode}`);
    }
    const result = await response.json();
    console.log(`Fetched latest price for product ${productCode}:`, result);
    return result;
  } catch (error) {
    console.error(`Error in getLatestPriceByProductCode for ${productCode}:`, error);
    return {
      code: "999",
      message: error instanceof Error ? error.message : "Unknown error fetching latest price",
      data: null,
    };
  }
}

// Create a new price
export async function createPrice(price: Price): Promise<ResultService<Price>> {
  try {
    const response = await fetch(`${PRICE_API_URL}/createPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(price),
    });

    if (!response.ok) {
      throw new Error("Error creating price");
    }

    const result = await response.json();
    console.log("Created price:", result);
    return result;
  } catch (error) {
    console.error("Error in createPrice:", error);
    return {
      code: "999",
      message: error instanceof Error ? error.message : "Unknown error creating price",
      data: null,
    };
  }
}


export async function deletePrice(priceCode: string): Promise<ResultService<void>> {
  try {
    const response = await fetch(`${PRICE_API_URL}/delete/${encodeURIComponent(priceCode)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting price with code ${priceCode}`);
    }
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error deleting price";
    return {
      code: "999",
      message: errorMessage,
      data: null,
    };
  }
}

export type { Price };