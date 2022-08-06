export interface IVerifyEmail {
    nickname: string;
    verifyEmailLink: string;
}
export declare const genVerifyEmail: ({ nickname, verifyEmailLink, }: IVerifyEmail) => {
    text: string;
    html: string;
};
