import { BaseEntity } from "../../Base/BaseEntity";
import { Price } from "../Price/Price";
import { ProductImage } from "../ProductImage/ProductImage";

export interface Product extends BaseEntity {
  productCode: string;
  productName: string;
  categoryCode?: string; 
  brandCode?: string; 
  uoMCode?: string; 
  description?: string;
  images?: ProductImage[];
  price?: Price; // Add price field
}