import { ResultService } from "../../../types/Base/ResultService";
import { ProductCategory } from "../../../types/ProductClassification/Category/ProductCategory";
import { PRODUCT_CATEGORY_API_URL } from "../../apiConfig";

// Cache for storing fetched product categories
let productCategoryCache: ProductCategory[] | null = null;

export async function getAllProductCategories(options: { cache: boolean } = { cache: true }): Promise<ResultService<ProductCategory[]>> {
  if (options.cache && productCategoryCache) {
    return { code: "0", message: "Success", data: productCategoryCache };
  }

  const response = await fetch(PRODUCT_CATEGORY_API_URL);
  if (!response.ok) {
    throw new Error("Error when calling API for ProductCategory");
  }
  const result: ResultService<ProductCategory[]> = await response.json();
  productCategoryCache = result.data;
  return result;
}

export async function getProductCategoryById(id: number): Promise<ProductCategory> {
  const response = await fetch(`${PRODUCT_CATEGORY_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching product category with ID ${id}`);
  }
  return response.json();
}

export async function deleteProductCategory(id: number): Promise<void> {
  const response = await fetch(PRODUCT_CATEGORY_API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  if (!response.ok) {
    throw new Error(`Error deleting product category with ID ${id}`);
  }
}

export async function getProductCategoryByCode(categoryCode: string): Promise<ResultService<ProductCategory>> {
  const response = await fetch(`${PRODUCT_CATEGORY_API_URL}/categoryCode/${categoryCode}`);
  if (!response.ok) {
    throw new Error(`Error fetching product category with code ${categoryCode}`);
  }
  return response.json();
}

export async function saveProductCategoryByDapper(productCategory: ProductCategory): Promise<ResultService<ProductCategory>> {
  const response = await fetch(`${PRODUCT_CATEGORY_API_URL}/SaveByDapper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productCategory),
  });
  if (!response.ok) {
    throw new Error("Error saving product category");
  }
  const result = await response.json();
  if (result.code === "0" && productCategoryCache) {
    const index = productCategoryCache.findIndex((c) => c.categoryCode === productCategory.categoryCode);
    if (index !== -1) {
      productCategoryCache[index] = result.data;
    } else {
      productCategoryCache.push(result.data);
    }
  }
  return result;
}

export async function deleteProductCategoryByDapper(categoryCode: string): Promise<ResultService<void>> {
  const response = await fetch(`${PRODUCT_CATEGORY_API_URL}/DeleteByDapper?categoryCode=${encodeURIComponent(categoryCode)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting product category with code ${categoryCode}`);
  }
  const result = await response.json();
  if (result.code === "0" && productCategoryCache) {
    productCategoryCache = productCategoryCache.filter((c) => c.categoryCode !== categoryCode);
  }
  return result;
}

export function clearProductCategoryCache(): void {
  productCategoryCache = null;
}