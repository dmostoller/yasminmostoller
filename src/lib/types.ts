// types.ts
export interface Painting {
  id: string;
  title: string;
  image: string;
  materials: string;
  width: number;
  height: number;
  sold: boolean;
  sale_price: number;
  folder_id: number;
}

export interface Folder {
  id: number;
  name: string;
}
