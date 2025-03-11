import { faker } from "@faker-js/faker";

type SocialClass =
  | "nerd"
  | "hot"
  | "popular"
  | "ghost"
  | "gamer"
  | "artist"
  | "rebel"
  | "geek"
  | "athlete";

interface User {
  name: string;
  age: number;
  interest: string;
  bio: string;
  nickname: string;
  socialRating: number;
  socialClass: SocialClass[];
}

const getRandomSocialClasses = (): SocialClass[] => {
  const classes: SocialClass[] = [
    "nerd",
    "hot",
    "popular",
    "ghost",
    "gamer",
    "artist",
    "rebel",
    "geek",
    "athlete",
  ];
  return faker.helpers.arrayElements(classes, { min: 1, max: 3 });
};

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 50 }),
    interest: faker.word.noun(),
    bio: faker.lorem.sentence(),
    nickname: faker.internet.userName(),
    socialRating: faker.number.float({ min: 0, max: 10 }),
    socialClass: getRandomSocialClasses(),
  }));
};

// const fetchedusers = generateUsers(100);

// export default fetchedusers;
