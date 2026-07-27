export interface PostViewModel {
    postId: number;
    userId: number;
    title: string;
    imgSrc: string;
    imgAlt: string;
    isDeleted: string;
    createAt: Date;
    username: string;
    isFav: boolean;
    favCount: number;
    commentCount: number;
}

export interface PostCommentViewModel {
    postId: number;
    userId: number;
    rating: number;
    comment: string;
    userName: string;
    title: string;
}