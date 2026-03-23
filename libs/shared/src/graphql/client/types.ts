export default {
  scalars: [0, 1, 3, 4, 5, 6, 7, 8, 10, 16],
  types: {
    AppCodes: {},
    AuthSessionEnum: {},
    CreateUserInput: {
      name: [3],
      email: [3],
      password: [3],
      __typename: [3],
    },
    String: {},
    DateTime: {},
    join__FieldSet: {},
    join__Graph: {},
    link__Import: {},
    link__Purpose: {},
    Mutation: {
      createUser: [
        15,
        {
          input: [2, 'CreateUserInput!'],
        },
      ],
      createSession: [
        13,
        {
          id: [10, 'Int!'],
        },
      ],
      __typename: [3],
    },
    Int: {},
    Query: {
      findOpenSessionByGuid: [
        13,
        {
          id: [3, 'String!'],
        },
      ],
      __typename: [3],
    },
    SessionOutput: {
      id: [10],
      guid: [3],
      userId: [10],
      status: [1],
      createdAt: [4],
      updatedAt: [4],
      __typename: [3],
    },
    SessionOutputDto: {
      data: [12],
      code: [0],
      __typename: [3],
    },
    UserOutput: {
      id: [10],
      name: [3],
      email: [3],
      createdAt: [4],
      updatedAt: [4],
      __typename: [3],
    },
    UserOutputDto: {
      data: [14],
      code: [0],
      __typename: [3],
    },
    Boolean: {},
  },
};
