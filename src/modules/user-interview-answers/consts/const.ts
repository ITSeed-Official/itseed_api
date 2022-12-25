export interface Question {
  number: number;
  title: string;
  answer: string;
}

export const interviewQuestions: Question[] = [
  {
    number: 1,
    title:
      "你為什麼想報名資訊種子呢？你希望資訊種子為你帶來什麼幫助？（限 300 字內）",
    answer: "",
  },
  {
    number: 2,
    title: "你認為什麼是 Giver？你曾經擔任過嗎？（限 300 字以內）",
    answer: "",
  },
  {
    number: 3,
    title:
      "如果你成功入選 20 屆資訊種子培訓計畫，請問你認為自身能為該屆培訓計畫帶來什麼改變？（限 300 字內）",
    answer: "",
  },
  {
    number: 4,
    title:
      "請問假如你成功加入資種，未來一年會如何規劃時間？請以「小時」為時間單位進行一週的時間規劃。（限 200 字內）",
    answer: "",
  },
  {
    number: 5,
    title:
      "假設你成功加入資訊種子，你將與六位陌生的組員組成團隊，執行第一個專案「TUV」，你期望自己在小組中扮演什麼角色並說明原因（限 500 字內）",
    answer: "",
  },
  {
    number: 6,
    title:
      "請從過去的經歷中挑選一項你認為失敗的團隊經驗？如果重來一次，你會怎麼做？為什麼？（限 500 字內）",
    answer: "",
  },
];
