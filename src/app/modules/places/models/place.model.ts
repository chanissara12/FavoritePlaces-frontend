export interface PlacesViewModel {
  placeId: number;
  title: string;
  imgSrc: string;
  imgAlt: string;
  addBy: string;
  isApproved: string;
  isDeleted: string;
  userId: number;
  username: string;
  isFav: boolean;
  hasComment: boolean;
  commentCount: number;
  allowDelete: boolean;
}

export interface PlaceComment {
  userId: number;
  userName: string;
  placeId: number;
  title: string;
  rating: number;
  comment: string;
}
