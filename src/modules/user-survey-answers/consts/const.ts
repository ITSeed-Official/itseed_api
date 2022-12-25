export interface Question {
  number: number;
  title: string;
  options: { number: number; description: string }[];
  answer: number | null;
}

export const surveyQuestions: Question[] = [
  {
    number: 1,
    title: "在同事（同學）眼中您是一位？",
    options: [
      {
        number: 1,
        description: "積極、熱情、有行動力的人",
      },
      {
        number: 2,
        description: "活潑、開朗、風趣幽默的人",
      },
      {
        number: 3,
        description: "忠誠、隨和、容易相處的人。",
      },
      {
        number: 4,
        description: "謹慎、冷靜、注意細節的人",
      },
    ],
    answer: null,
  },
  {
    number: 2,
    title: "您喜歡看哪一類型的雜誌？",
    options: [
      {
        number: 1,
        description: "管理、財經、趨勢類",
      },
      {
        number: 2,
        description: "旅遊、美食、時尚類",
      },
      {
        number: 3,
        description: "心靈、散文、家庭類",
      },
      {
        number: 4,
        description: "科技、專業、藝術類",
      },
    ],
    answer: null,
  },
  {
    number: 3,
    title: "您做決策的方式？",
    options: [
      {
        number: 1,
        description: "希望能立即有效",
      },
      {
        number: 2,
        description: "感覺重於一切",
      },
      {
        number: 3,
        description: "有一定的消費習慣，不太喜歡變化",
      },
      {
        number: 4,
        description: "較注意東西好不好，較有成本觀念",
      },
    ],
    answer: null,
  },
  {
    number: 4,
    title: "職務上哪種工作是我最擅長的？",
    options: [
      {
        number: 1,
        description: "以目標為導向，有不服輸的精神",
      },
      {
        number: 2,
        description: "良好的口才，能主動的與人建立友善關係",
      },
      {
        number: 3,
        description: "能配合團隊，扮演忠誠的擁護者",
      },
      {
        number: 4,
        description: "流程的掌握，注意到細節",
      },
    ],
    answer: null,
  },
  {
    number: 5,
    title: "當面對壓力時，您會？",
    options: [
      {
        number: 1,
        description: "用行動力去面對它，並且克服它",
      },
      {
        number: 2,
        description: "希望找人傾吐，獲得認同",
      },
      {
        number: 3,
        description: "逆來順受，儘量避免衝突",
      },
      {
        number: 4,
        description: "重新思考緣由，必要時做精細的解說",
      },
    ],
    answer: null,
  },
  {
    number: 6,
    title: "與同事（同學）之間的相處？",
    options: [
      {
        number: 1,
        description: "以公事為主，很少談到個人生活",
      },
      {
        number: 2,
        description: "重視氣氛，能夠帶動團隊情趣",
      },
      {
        number: 3,
        description: "良好的傾聽者，對人態度溫和友善",
      },
      {
        number: 4,
        description: "被動，不會主動與人建立關係",
      },
    ],
    answer: null,
  },
  {
    number: 7,
    title: "您希望別人如何與您溝通？",
    options: [
      {
        number: 1,
        description: "直接講重點，不要拐彎抹角",
      },
      {
        number: 2,
        description: "輕鬆，不要太嚴肅",
      },
      {
        number: 3,
        description: "不要一次說太多，要給予明確的支持",
      },
      {
        number: 4,
        description: "凡事說清楚，講明白",
      },
    ],
    answer: null,
  },
  {
    number: 8,
    title: "要完成一件事情時，您最在意的部份是？",
    options: [
      {
        number: 1,
        description: "效果是否有達到",
      },
      {
        number: 2,
        description: "過程是否快樂",
      },
      {
        number: 3,
        description: "前後是否有改變",
      },
      {
        number: 4,
        description: "流程是否正確",
      },
    ],
    answer: null,
  },
  {
    number: 9,
    title: "什麼事情會讓您恐懼？",
    options: [
      {
        number: 1,
        description: "呈現弱點，被人利用",
      },
      {
        number: 2,
        description: "失去認同，被人排擠",
      },
      {
        number: 3,
        description: "過度變動，讓人無所適從",
      },
      {
        number: 4,
        description: "制度不清，標準不一",
      },
    ],
    answer: null,
  },
  {
    number: 10,
    title: "哪些是您自覺的缺點？",
    options: [
      {
        number: 1,
        description: "沒有耐心",
      },
      {
        number: 2,
        description: "欠缺細心",
      },
      {
        number: 3,
        description: "沒有主見",
      },
      {
        number: 4,
        description: "欠缺風趣",
      },
    ],
    answer: null,
  },
];
