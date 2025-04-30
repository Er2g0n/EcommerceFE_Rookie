import { BaseEntity } from "../../Base/BaseEntity";

export interface Brand extends BaseEntity {
  brandCode: string;
  brandName: string;
  description?: string | null;
}
  
  export interface BrandDto {
    brandCode: string;
    brandName: string;
    id?: number;
    createdBy?: string | null;
    updatedBy?: string | null;
  }
  