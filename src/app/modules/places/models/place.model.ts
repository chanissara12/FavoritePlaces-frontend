export interface PlacesViewModel {
  placeId: number;
  title: string;
  imgSrc: string;
  imgAlt: string;
  addBy: string;
  isApproved: string;
  isDeleted: string;
  uploadedUserId: number;
  uploadedUserName: string;
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
