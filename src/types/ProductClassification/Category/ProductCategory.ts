import { BaseEntity } from "../../Base/BaseEntity";

export interface ProductCategory extends BaseEntity {
  categoryCode: string;
  categoryName: string;
}

export interface ProductCategoryDto {
  categoryCode: string;
  categoryName: string;
  id?: number;
  createdBy?: string | null;
  updatedBy?: string | null;
}
