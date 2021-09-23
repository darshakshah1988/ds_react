// This type is only used on the artist cards during listing.
export interface IArtData {
  _id: string;
  fileUrl: string;
  currency: string;
  category: string;
  subCategory: string;
  name: string;
  price: string;
  registeredDate: string;
  artist: {
    name: string;
    [property: string]: any;
  };
  [property: string]: any;
}

export type ImageSize = {
  length: string;
  width: string;
  height: string;
  dimension: string;
};

export type Art = {
  artFile: any;
  artistName: string;
  name: string;
  price: string;
  registeredDate: Date | string | null | undefined;
  category: string;
  subCategory: string;
  material: string;
  size: ImageSize;
  holdings: string;
  collectors: string;
  source: string;
  description: string;
};
