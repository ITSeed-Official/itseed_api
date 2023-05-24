export interface GradeOption {
  title: string;
  value: number;
  selected: boolean;
}

export const gradeOptions: GradeOption[] = [
  {
    title: "大一",
    value: 1,
    selected: false,
  },
  {
    title: "大二",
    value: 2,
    selected: false,
  },
  {
    title: "大三",
    value: 3,
    selected: false,
  },
  {
    title: "大四",
    value: 4,
    selected: false,
  },
  {
    title: "大五",
    value: 5,
    selected: false,
  },
  {
    title: "碩一",
    value: 6,
    selected: false,
  },
];

export interface RefererOption {
  title: string;
  value: string;
  selected: boolean;
}

export const refererOptions: RefererOption[] = [
  {
    title: "海報",
    value: "poster",
    selected: false,
  },
  {
    title: "說明會",
    value: "seminar",
    selected: false,
  },
  {
    title: "工作坊",
    value: "workshop",
    selected: false,
  },
  {
    title: "FB粉專(懶人包、宣傳影片等)",
    value: "fb_fanpage",
    selected: false,
  },
  {
    title: "官網",
    value: "itseed_website",
    selected: false,
  },
  {
    title: "Blink",
    value: "blink",
    selected: false,
  },
  {
    title: "Dcard",
    value: "dcard",
    selected: false,
  },
  {
    title: "親友推薦",
    value: "friends",
    selected: false,
  },
  {
    title: "其他",
    value: "others",
    selected: false,
  },
];

export const REGISTRATION = 0;
export const USER_SURVEY_COMPLETION = 1;
export const USER_INFO_COMPLETION = 2;
export const USER_INTERVIEW_COMPLETION = 3;
export const USER_FILE_COMPLETION = 4;

export const CURRENT_YEAR = new Date().getFullYear();
// ISO 8601
export const START_TIME =
  process.env.START_TIME || `${CURRENT_YEAR.toString()}-06-01T16:00:00.000Z`;
// ISO 8601
export const END_TIME =
  process.env.END_TIME || `${CURRENT_YEAR.toString()}-07-01T15:59:59.999Z`;
