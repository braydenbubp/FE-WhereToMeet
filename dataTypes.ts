// -----main types-----
export type User = {
  userId: string; //primary key
  name: string;
  phone: number;
  email: string;
  address: {
    street: string;
    zipcode: number;
    city: string
    state: string;
    private: boolean;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  friends: string[];
};

export type Group = {
  groupId: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: string[]; //array of userIds
};

export type Event = {
  eventId: string; //primary key
  ownerId: string; //foreign key
  groupId: string; //foreign key

  description: string;
  location: Location;
  time: string; // datetime string

  suggestions: Location[];
  messages: Message[];
};

//------ sub-types------
export type Location = {
  name: string;
  url: string;
  address: {
    street: string;
    zipcode: number;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  votes: vote[];
};

export type Message = {
  messageId: string;
  userId: string;
  name: string;
  email: string;
  message: string;
  created: string; // datetime string
  updated: string | null; // datetime string
};

export type vote = {
  count: number;
  userId: string;
};