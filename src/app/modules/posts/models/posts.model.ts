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
    commentId: number;
    postId: number;
    userId: number;
    comment: string;
    createAt: Date;
    userName: string;
    title: string;
}