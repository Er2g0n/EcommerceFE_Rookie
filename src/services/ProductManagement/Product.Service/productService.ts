import { ResultService } from "../../../types/Base/ResultService";
import { Product } from "../../../types/ProductManagement/Product/Product";
import { ProductImage } from "../../../types/ProductManagement/ProductImage/ProductImage";
import { PRODUCT_API_URL } from '../../apiConfig'; // chỉnh path đúng thư mục




// Cache for storing fetched products
let productCache: Product[] | null = null;

// Fetch all products
export async function getAllProducts(options: { cache: boolean } = { cache: true }): Promise<ResultService<Product[]>> {
  if (options.cache && productCache) {
    return { code: "0", message: "Success", data: productCache };
  }

  const response = await fetch(PRODUCT_API_URL);
  if (!response.ok) {
    throw new Error('Error when calling API for Product');
  }
  const result: ResultService<Product[]> = await response.json();
  productCache = result.data;
  return result;
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
export async function getImagesByProductCode(productCode: string): Promise<ResultService<ProductImage>> {
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

// Save a product and its images (multipart/form-data)
// export async function saveProductAndImage(productDto: { product: Product, images: File[], primaryImageIndex?: number }): Promise<ResultService<Product>> {
//   const formData = new FormData();
  
//   // Append product data
//   formData.append("ProductCode", productDto.product.productCode || "");
//   formData.append("ProductName", productDto.product.productName);
//   formData.append("Description", productDto.product.description || "");
//   formData.append("CategoryCode", productDto.product.categoryCode || "");
//   formData.append("BrandCode", productDto.product.brandCode || "");
//   formData.append("UoMCode", productDto.product.uoMCode || "");
  
//   // Append images
//   // productDto.images.forEach((image, index) => {
//   //   formData.append("Images", image);
//   // });

//   // Append primary image index if provided
//   if (productDto.primaryImageIndex !== undefined) {
//     formData.append("PrimaryImageIndex", productDto.primaryImageIndex.toString());
//   }

//   const response = await fetch(`${PRODUCT_API_URL}/SaveProductAndImage`, {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Error saving product and images");
//   }
//   const result = await response.json();
//   if (result.code === "0" && productCache) {
//     const index = productCache.findIndex((p) => p.productCode === productDto.product.productCode);
//     if (index !== -1) {
//       productCache[index] = result.data.products[0];
//     } else {
//       productCache.push(result.data.products[0]);
//     }
//   }
//   return result;
// }

// Delete a product and its images
export async function deleteProductAndImage(productImages: { refProductCode: string, imagePath: string, isPrimary: boolean }[]): Promise<ResultService<void>> {
  const response = await fetch(`${PRODUCT_API_URL}/Delete_ProductAndImage`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productImages),
  });

  if (!response.ok) {
    throw new Error("Error deleting product and images");
  }
  const result = await response.json();
  if (result.code === "0" && productCache && productImages.length > 0) {
    const productCode = productImages[0].refProductCode;
    productCache = productCache.filter((p) => p.productCode !== productCode);
  }
  return result;
}

// Clear the product cache
export function clearProductCache(): void {
  productCache = null;
}