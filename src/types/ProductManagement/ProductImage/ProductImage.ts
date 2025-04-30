import { BaseEntity } from "../../Base/BaseEntity";

  export interface ProductImage extends BaseEntity {
    refProductCode?: string;
    position?: number;
    size?: number;
    imagePath?: string;
    folderPath?: string;
    isPrimary?: boolean;
  }
  
  export interface ImageDto {
    properties: ProductImage;
    file?: File;
  }