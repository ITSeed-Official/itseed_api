export interface Question {
  number: number;
  title: string;
  answer: string;
  limit: number;
}

export const interviewQuestions: Question[] = [
  {
    number: 1,
    title:
      "你為什麼想報名資訊種子呢？你希望資訊種子為你帶來什麼幫助？（限 300 字內）",
    answer: "",
    limit: 300,
  },
  {
    number: 2,
    title: "你認為什麼是 Giver？你曾經擔任過嗎？（限 300 字以內）",
    answer: "",
    limit: 300,
  },
  {
    number: 3,
    title: "請問假如你成功加入資種，未來一年有哪些個人規劃（限 200 字內）",
    answer: "",
    limit: 200,
  },
  {
    number: 4,
    title:
      "如果你成功入選資訊種子培訓計畫，請問你認為自身能為該屆培訓計畫帶來什麼改變？你期望自己扮演什麼角色並說明原因？（限 500 字內）",
    answer: "",
    limit: 500,
  },
  {
    number: 5,
    title:
      "請從過去的經歷中挑選一項你認為失敗的團隊經驗？如果重來一次，你會怎麼做？為什麼？（限 500 字內）",
    answer: "",
    limit: 500,
  },
];
