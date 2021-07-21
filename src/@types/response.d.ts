export interface UserResponse {
  id: number;

  username: string;

  password?: string;

  name: string;

  updatedAt?: Date;

  createdAt?: Date;
}

export interface BatchResponse {
  id: number;

  user?: UserResponse;

  customer: string;

  proveedor: string;

  visual: string;

  batch: string;

  quantity: number;

  po: string;

  produto: string;

  codigo: string;

  loteCorrelativoA?: string;

  loteCorrelativoB?: string;

  descricaoProduto1?: string;

  descricaoProduto2?: string;

  correlativo?: string;

  fileName: string;

  updatedAt: Date;

  createdAt: Date;
}

export interface IccidResponse {
  id: number;

  batch: BatchResponse;

  iccid: string;

  imsi: string;

  correlativo?: string;

  user?: UserResponse;

  updatedAt: Date;

  createdAt: Date;
}
