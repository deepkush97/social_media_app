// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Boolean: boolean,
    String: string,
    Int: number,
    DateTime: any,
    join__FieldSet: any,
    link__Import: any,
}

export type AppCodes = 'OPERATION_SUCCESS' | 'INVALID_CREDENTIALS' | 'INVALID_EMAIL' | 'INTERNAL_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'USER_CREATED' | 'BAD_REQUEST' | 'URL_CREATED' | 'URL_NOT_FOUND' | 'NOT_FOUND'

export type AuthSessionEnum = 'OPEN' | 'CLOSED'

export interface BooleanOutputDto {
    data: (Scalars['Boolean'] | null)
    code: AppCodes
    __typename: 'BooleanOutputDto'
}

export type join__Graph = 'AUTH' | 'POSTS'

export type link__Purpose = 'SECURITY' | 'EXECUTION'

export interface Mutation {
    createUser: UserOutputDto
    createSession: SessionOutputDto
    loginUser: UserOutputDto
    closeAllOpenSessionByUserId: BooleanOutputDto
    closeSessionBySessionId: BooleanOutputDto
    createPost: PostOutputDto
    __typename: 'Mutation'
}

export interface PostOutput {
    id: Scalars['Int']
    title: Scalars['String']
    content: Scalars['String']
    image: (Scalars['String'] | null)
    userId: Scalars['Int']
    status: PostStatusEnum
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
    __typename: 'PostOutput'
}

export interface PostOutputDto {
    data: (PostOutput | null)
    code: AppCodes
    __typename: 'PostOutputDto'
}

export type PostStatusEnum = 'ACTIVE' | 'ARCHIVED'

export interface Query {
    findUserById: UserOutputDto
    findOpenSessionByGuid: SessionOutputDto
    __typename: 'Query'
}

export interface SessionOutput {
    id: Scalars['Int']
    guid: Scalars['String']
    userId: Scalars['Int']
    status: AuthSessionEnum
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
    __typename: 'SessionOutput'
}

export interface SessionOutputDto {
    data: (SessionOutput | null)
    code: AppCodes
    __typename: 'SessionOutputDto'
}

export interface UserOutput {
    id: Scalars['Int']
    name: Scalars['String']
    email: Scalars['String']
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
    __typename: 'UserOutput'
}

export interface UserOutputDto {
    data: (UserOutput | null)
    code: AppCodes
    __typename: 'UserOutputDto'
}

export interface BooleanOutputDtoGenqlSelection{
    data?: boolean | number
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CreatePostInput {title: Scalars['String'],content: Scalars['String'],image?: (Scalars['String'] | null),userId: Scalars['Int']}

export interface CreateUserInput {name: Scalars['String'],email: Scalars['String'],password: Scalars['String']}

export interface LoginUserInput {email: Scalars['String'],password: Scalars['String']}

export interface MutationGenqlSelection{
    createUser?: (UserOutputDtoGenqlSelection & { __args: {input: CreateUserInput} })
    createSession?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    loginUser?: (UserOutputDtoGenqlSelection & { __args: {input: LoginUserInput} })
    closeAllOpenSessionByUserId?: (BooleanOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    closeSessionBySessionId?: (BooleanOutputDtoGenqlSelection & { __args: {guid: Scalars['String']} })
    createPost?: (PostOutputDtoGenqlSelection & { __args: {input: CreatePostInput} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostOutputGenqlSelection{
    id?: boolean | number
    title?: boolean | number
    content?: boolean | number
    image?: boolean | number
    userId?: boolean | number
    status?: boolean | number
    createdAt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostOutputDtoGenqlSelection{
    data?: PostOutputGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    findUserById?: (UserOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findOpenSessionByGuid?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['String']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SessionOutputGenqlSelection{
    id?: boolean | number
    guid?: boolean | number
    userId?: boolean | number
    status?: boolean | number
    createdAt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SessionOutputDtoGenqlSelection{
    data?: SessionOutputGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserOutputGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    email?: boolean | number
    createdAt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserOutputDtoGenqlSelection{
    data?: UserOutputGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const BooleanOutputDto_possibleTypes: string[] = ['BooleanOutputDto']
    export const isBooleanOutputDto = (obj?: { __typename?: any } | null): obj is BooleanOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBooleanOutputDto"')
      return BooleanOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const PostOutput_possibleTypes: string[] = ['PostOutput']
    export const isPostOutput = (obj?: { __typename?: any } | null): obj is PostOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostOutput"')
      return PostOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PostOutputDto_possibleTypes: string[] = ['PostOutputDto']
    export const isPostOutputDto = (obj?: { __typename?: any } | null): obj is PostOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostOutputDto"')
      return PostOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const SessionOutput_possibleTypes: string[] = ['SessionOutput']
    export const isSessionOutput = (obj?: { __typename?: any } | null): obj is SessionOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSessionOutput"')
      return SessionOutput_possibleTypes.includes(obj.__typename)
    }
    


    const SessionOutputDto_possibleTypes: string[] = ['SessionOutputDto']
    export const isSessionOutputDto = (obj?: { __typename?: any } | null): obj is SessionOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSessionOutputDto"')
      return SessionOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const UserOutput_possibleTypes: string[] = ['UserOutput']
    export const isUserOutput = (obj?: { __typename?: any } | null): obj is UserOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserOutput"')
      return UserOutput_possibleTypes.includes(obj.__typename)
    }
    


    const UserOutputDto_possibleTypes: string[] = ['UserOutputDto']
    export const isUserOutputDto = (obj?: { __typename?: any } | null): obj is UserOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserOutputDto"')
      return UserOutputDto_possibleTypes.includes(obj.__typename)
    }
    

export const enumAppCodes = {
   OPERATION_SUCCESS: 'OPERATION_SUCCESS' as const,
   INVALID_CREDENTIALS: 'INVALID_CREDENTIALS' as const,
   INVALID_EMAIL: 'INVALID_EMAIL' as const,
   INTERNAL_ERROR: 'INTERNAL_ERROR' as const,
   UNAUTHORIZED: 'UNAUTHORIZED' as const,
   FORBIDDEN: 'FORBIDDEN' as const,
   USER_CREATED: 'USER_CREATED' as const,
   BAD_REQUEST: 'BAD_REQUEST' as const,
   URL_CREATED: 'URL_CREATED' as const,
   URL_NOT_FOUND: 'URL_NOT_FOUND' as const,
   NOT_FOUND: 'NOT_FOUND' as const
}

export const enumAuthSessionEnum = {
   OPEN: 'OPEN' as const,
   CLOSED: 'CLOSED' as const
}

export const enumJoinGraph = {
   AUTH: 'AUTH' as const,
   POSTS: 'POSTS' as const
}

export const enumLinkPurpose = {
   SECURITY: 'SECURITY' as const,
   EXECUTION: 'EXECUTION' as const
}

export const enumPostStatusEnum = {
   ACTIVE: 'ACTIVE' as const,
   ARCHIVED: 'ARCHIVED' as const
}
