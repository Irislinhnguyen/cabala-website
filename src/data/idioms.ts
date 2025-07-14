export interface Idiom {
  id: string;
  idiom: string;
  meaning: string;
  example: string;
  note?: string;
}

export const idioms: Idiom[] = [
  {
    id: "id001",
    idiom: "Break the ice",
    meaning: "To initiate conversation or interaction in a social setting",
    example: "At the party, John told a funny joke to break the ice with the new colleagues.",
    note: "Often used in social or professional networking situations"
  },
  {
    id: "id002",
    idiom: "Bite the bullet",
    meaning: "To face a difficult or unpleasant situation with courage",
    example: "She decided to bite the bullet and tell her boss about the mistake.",
    note: "Originally from military contexts, now used for any challenging situation"
  },
  {
    id: "id003",
    idiom: "Hit the nail on the head",
    meaning: "To describe something exactly right or do something perfectly",
    example: "When she said the project needed better communication, she hit the nail on the head.",
    note: "Used to express perfect accuracy or correctness"
  },
  {
    id: "id004",
    idiom: "Spill the beans",
    meaning: "To reveal a secret or tell information that was supposed to be kept private",
    example: "I wasn't supposed to tell anyone about the surprise party, but I accidentally spilled the beans.",
    note: "Informal expression, often used when someone reveals information unintentionally"
  },
  {
    id: "id005",
    idiom: "Cost an arm and a leg",
    meaning: "To be very expensive",
    example: "That designer handbag cost an arm and a leg, but she bought it anyway.",
    note: "Emphasizes something is extremely expensive or overpriced"
  },
  {
    id: "id006",
    idiom: "Don't cry over spilled milk",
    meaning: "Don't worry about things that have already happened and cannot be changed",
    example: "Yes, you failed the test, but don't cry over spilled milk - focus on the next one.",
    note: "Used to encourage someone not to dwell on past mistakes"
  },
  {
    id: "id007",
    idiom: "A piece of cake",
    meaning: "Something that is very easy to do",
    example: "The math homework was a piece of cake after studying all weekend.",
    note: "Informal way to describe something as simple or effortless"
  },
  {
    id: "id008",
    idiom: "The ball is in your court",
    meaning: "It's your turn to make a decision or take action",
    example: "I've given you all the information you need. The ball is in your court now.",
    note: "From tennis, used to indicate someone has the responsibility to act"
  },
  {
    id: "id009",
    idiom: "Under the weather",
    meaning: "Feeling sick or unwell",
    example: "I'm feeling a bit under the weather today, so I might leave work early.",
    note: "A polite way to say you're not feeling well"
  },
  {
    id: "id010",
    idiom: "Let the cat out of the bag",
    meaning: "To reveal a secret accidentally",
    example: "We wanted to keep the promotion secret, but Tom let the cat out of the bag.",
    note: "Similar to 'spill the beans' but often implies accidental revelation"
  },
  {
    id: "id011",
    idiom: "Kill two birds with one stone",
    meaning: "To accomplish two tasks with a single action",
    example: "By walking to the store, I can get exercise and buy groceries - killing two birds with one stone.",
    note: "Emphasizes efficiency and multitasking"
  },
  {
    id: "id012",
    idiom: "When pigs fly",
    meaning: "Something that will never happen",
    example: "He'll clean his room when pigs fly - it's never going to happen.",
    note: "Used to express that something is impossible or highly unlikely"
  },
  {
    id: "id013",
    idiom: "It's raining cats and dogs",
    meaning: "It's raining very heavily",
    example: "We can't go to the picnic today - it's raining cats and dogs outside.",
    note: "Colorful way to describe heavy rain"
  },
  {
    id: "id014",
    idiom: "Don't put all your eggs in one basket",
    meaning: "Don't risk everything on a single opportunity or investment",
    example: "You should apply to multiple universities - don't put all your eggs in one basket.",
    note: "Advice about diversifying risks and opportunities"
  },
  {
    id: "id015",
    idiom: "The early bird catches the worm",
    meaning: "People who wake up early or act quickly get the best opportunities",
    example: "I got the best seat at the concert because I arrived early - the early bird catches the worm.",
    note: "Encourages being proactive and starting early"
  }
];

export const getTotalIdiomsCount = () => idioms.length;
export const getIdiomById = (id: string) => idioms.find(idiom => idiom.id === id);
export const getRandomIdioms = (count: number) => {
  const shuffled = [...idioms].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 