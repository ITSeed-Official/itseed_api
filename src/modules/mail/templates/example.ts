import mjml2html from 'mjml';

export interface IVerifyEmail {
  nickname: string;
  verifyEmailLink: string;
}

export const genVerifyEmail = ({
  nickname,
  verifyEmailLink,
}: IVerifyEmail) => ({
  text: `Hello ${nickname}: 請點擊連結來驗證信箱，如果未有註冊帳號，請忽略此信件。 ${verifyEmailLink}`,
  html: mjml2html(
    `
    <mjml>
    <mj-body>
      <mj-section>
        <mj-column width="375px">
          <mj-text color="272838" font-size="14px">
            哈囉 ${nickname}:
          </mj-text>
          <mj-text color="272838" font-size="14px">
            請點擊下方按鈕來驗證信箱。
          </mj-text>
          <mj-text color="272838" font-size="14px">
          如果未有註冊帳號，請忽略此信件。
          </mj-text>
          <mj-spacer height="20px" />
          <mj-button href="${verifyEmailLink}" align="center" background-color="2B354D" font-size="14px">
            驗證信箱
          </mj-button>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`,
  ).html,
});
