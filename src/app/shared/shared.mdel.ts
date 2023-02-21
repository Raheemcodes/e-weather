export interface MetaInterface extends Card {
  keywords: string;
}

export interface Card {
  title: string;
  description: string;
  img: string;
  path: string;
}

export interface Project {
  title: string;
  img: string;
  desc: string;
  areas: string[];
  link: { github: string; website?: string };
  background: string;
}
