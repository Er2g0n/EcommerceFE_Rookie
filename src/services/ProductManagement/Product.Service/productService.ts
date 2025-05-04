import { ResultService } from "../../../types/Base/ResultService";
import { Product } from "../../../types/ProductManagement/Product/Product";
import { ProductImage } from "../../../types/ProductManagement/ProductImage/ProductImage";
import { PRODUCT_API_URL } from "../../apiConfig"; // Ensure this points to the correct backend API URL
import { getLatestPriceByProductCode } from "../Price.Service/priceService";

// Cache for storing fetched products
let productCache: Product[] | null = null;

// Fetch all products
export async function getAllProducts(options: { cache: boolean } = { cache: true }): Promise<ResultService<Product[]>> {
  if (options.cache && productCache) {
    console.log("Returning cached products:", productCache);
    return { code: "0", message: "Success", data: productCache };
  }

  try {
    console.log("Fetching products from API:", PRODUCT_API_URL);
    const response = await fetch(PRODUCT_API_URL);
    if (!response.ok) {
      throw new Error('Error when calling API for Product');
    }

    const result = (await response.json()) as ResultService<Product[]>;
    
    if (result.code === "0" && Array.isArray(result.data)) {
      const productsWithDetails = await Promise.all(
        result.data.map(async (product) => {
          try {
            const [imagesResult, priceResult] = await Promise.all([
              getImagesByProductCode(product.productCode),
              getLatestPriceByProductCode(product.productCode),
            ]);
            // Gán hình ảnh
            if (imagesResult.code === "0" && Array.isArray(imagesResult.data)) {
              product.images = imagesResult.data;
            } else {
              product.images = [];
            }
            // Gán giá
            if (priceResult.code === "0" && priceResult.data) {
              product.price = priceResult.data;
            } else {
              product.price = undefined;
            }
          } catch (error) {
            console.error(`Error fetching details for product ${product.productCode}:`, error);
            product.images = [];
            product.price = undefined;
          }
          return product;
        })
      );

      result.data = productsWithDetails;
      productCache = productsWithDetails;
      console.log("Updated product cache:", productCache);
    } else {
      return {
        code: result.code || "1",
        message: result.message || "No products found",
        data: [],
      };
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error fetching products";
    console.error("Error in getAllProducts:", errorMessage);
    return {
      code: "999",
      message: errorMessage,
      data: [],
    };
  }
}
// Update the product cache after image upload
export async function updateProductImagesInCache(productCode: string, images: ProductImage[]): Promise<void> {
  if (productCache) {
    const index = productCache.findIndex((p) => p.productCode === productCode);
    if (index !== -1) {
      productCache[index] = { ...productCache[index], images };
    }
  }
}

// Fetch a product by ID
export async function getProductById(id: number): Promise<ResultService<Product>> {
  const response = await fetch(`${PRODUCT_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching product with ID ${id}`);
  }
  return response.json();
}

// Fetch a product by code
export async function getProductByCode(productCode: string): Promise<ResultService<Product>> {
  const response = await fetch(`${PRODUCT_API_URL}/code/${encodeURIComponent(productCode)}`);
  if (!response.ok) {
    throw new Error(`Error fetching product with code ${productCode}`);
  }
  return response.json();
}

// Fetch a product and its images by code
export async function getImagesByProductCode(productCode: string): Promise<ResultService<ProductImage[]>> {
  const response = await fetch(`${PRODUCT_API_URL}/code/${encodeURIComponent(productCode)}/images`);
  if (!response.ok) {
    throw new Error(`Error fetching product and images with code ${productCode}`);
  }
  return response.json();
}

// Save a product using Dapper
export async function saveProductByDapper(product: Product): Promise<ResultService<Product>> {
  const response = await fetch(`${PRODUCT_API_URL}/SaveByDapper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error("Error saving product");
  }
  const result = await response.json();
  if (result.code === "0" && productCache) {
    const index = productCache.findIndex((p) => p.productCode === product.productCode);
    if (index !== -1) {
      productCache[index] = result.data;
    } else {
      productCache.push(result.data);
    }
  }
  return result;
}

// Delete a product by code using Dapper
export async function deleteProductByDapper(productCode: string): Promise<ResultService<void>> {
  const response = await fetch(`${PRODUCT_API_URL}/DeleteByDapper?productCode=${encodeURIComponent(productCode)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting product with code ${productCode}`);
  }
  const result = await response.json();
  if (result.code === "0" && productCache) {
    productCache = productCache.filter((p) => p.productCode !== productCode);
  }
  return result;
}

