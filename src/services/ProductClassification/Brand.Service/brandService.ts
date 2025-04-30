import { ResultService } from "../../../types/Base/ResultService";
import { Brand } from "../../../types/ProductClassification/Brand/Brand";
import { BRAND_API_URL } from "../../apiConfig";

// Cache for storing fetched brands
let brandCache: Brand[] | null = null;


export async function getAllBrands(options: { cache: boolean } = { cache: true }): Promise<ResultService<Brand[]>> {
  if (options.cache && brandCache) {
    return { code: "0", message: "Success", data: brandCache };
  }

  const response = await fetch(BRAND_API_URL);
  if (!response.ok) {
    throw new Error("Error when calling API for Brand");
  }
  const result: ResultService<Brand[]> = await response.json();
  brandCache = result.data;
  return result;
}

export async function getBrandById(id: number): Promise<Brand> {
  const response = await fetch(`${BRAND_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching brand with ID ${id}`);
  }
  return response.json();
}

export async function deleteBrand(id: number): Promise<void> {
  const response = await fetch(BRAND_API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  if (!response.ok) {
    throw new Error(`Error deleting brand with ID ${id}`);
  }
}

export async function getBrandByCode(brandCode: string): Promise<ResultService<Brand>> {
  const response = await fetch(`${BRAND_API_URL}/brandCode/${brandCode}`);
  if (!response.ok) {
    throw new Error(`Error fetching brand with code ${brandCode}`);
  }
  return response.json();
}

export async function saveBrandByDapper(brand: Brand): Promise<ResultService<Brand>> {
  const response = await fetch(`${BRAND_API_URL}/SaveByDapper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
  if (!response.ok) {
    throw new Error("Error saving brand");
  }
  const result = await response.json();
  if (result.code === "0" && brandCache) {
    const index = brandCache.findIndex((b) => b.brandCode === brand.brandCode);
    if (index !== -1) {
      brandCache[index] = result.data;
    } else {
      brandCache.push(result.data);
    }
  }
  return result;
}

export async function deleteBrandByDapper(brandCode: string): Promise<ResultService<void>> {
  const response = await fetch(`${BRAND_API_URL}/DeleteByDapper?brandCode=${encodeURIComponent(brandCode)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting brand with code ${brandCode}`);
  }
  const result = await response.json();
  return result;
}


export function clearBrandCache(): void {
  brandCache = null;
}