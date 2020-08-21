import { IProduct } from 'app/shared/model/product.model';

export interface IProductBucket {
  id?: number;
  availableToSellQuantity?: number;
  inChargeQuantity?: number;
  brokenQuantity?: number;
  product?: IProduct;
}

export const defaultValue: Readonly<IProductBucket> = {};
