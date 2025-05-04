import { BaseEntity } from "../../Base/BaseEntity";

export interface Price extends BaseEntity {
  priceCode: string;
  productCode: string;
  priceCost?: number;
  priceSale?: number;
  priceVAT?: number;
  totalAmount?: number;
  startDate?: string;
  endDate?: string;
  applyDate?: string;
  priceStatus?: number;
}