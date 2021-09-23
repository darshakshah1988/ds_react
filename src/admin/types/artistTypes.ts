// This type is only used on the artist cards during listing.
export interface IArtistData {
  _id: string;
  name: string;
  overview: string;
  profilePicture: string | null;
  status: string;
  isDeleted: boolean;
  [property: string]: any;
}

export type NewArtist = {
  name: string;
  overview: string;
  status: boolean;
  profilePicture: any;
  notableArtworks: Array<any>;
  [property: string]: any;
};

export type ErrorStackForArt = {
  section: number;
  status: string;
  message: {
    statement: string;
    reason: string;
  };
};
