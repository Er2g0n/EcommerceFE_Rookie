import { BaseEntity } from "../../Base/BaseEntity";
import { ProductImage } from "../ProductImage/ProductImage";

export interface Product extends BaseEntity {
  productCode: string;
  productName: string;
  categoryCode?: string; 
  brandCode?: string; 
  uoMCode?: string; 
  description?: string;
  images?: ProductImage[];
}