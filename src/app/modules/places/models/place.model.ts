export interface Place {
  placeId: number;
  title: string;
  imgSrc: string;
  imgAlt: string;
  addBy: string;
  isApproved: string;
}

export interface PlaceComment {
  userId: number;
  userName: string;
  placeId: number;
  title: string;
  rating: number;
  comment: string;
}
