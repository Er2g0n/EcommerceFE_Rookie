import { BaseEntity } from "../../Base/BaseEntity";

export interface UnitOfMeasure extends BaseEntity {
  uoMCode: string;
  uoMName: string;
  uoMDescription?: string | null;
}

export interface UnitOfMeasureDto {
  uoMCode: string;
  uoMName: string;
  uoMDescription: string | null;
  id?: number;
  createdBy?: string | null;
  updatedBy?: string | null;
}
