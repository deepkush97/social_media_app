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
    Float: number,
}

export type AppCodes = 'OPERATION_SUCCESS' | 'INVALID_CREDENTIALS' | 'INVALID_EMAIL' | 'INTERNAL_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'USER_CREATED' | 'OK_CREATED' | 'BAD_REQUEST' | 'URL_CREATED' | 'URL_NOT_FOUND' | 'NOT_FOUND'

export type AuthSessionEnum = 'OPEN' | 'CLOSED'

export interface BooleanOutputDto {
    data: (Scalars['Boolean'] | null)
    code: AppCodes
    __typename: 'BooleanOutputDto'
}

export interface FollowerFollowingCountDto {
    followers: Scalars['Int']
    followings: Scalars['Int']
    __typename: 'FollowerFollowingCountDto'
}

export interface InteractionDto {
    id: Scalars['Int']
    userId: Scalars['Int']
    postId: Scalars['Int']
    createdAt: Scalars['DateTime']
    __typename: 'InteractionDto'
}

export interface InteractionOutputDto {
    data: (InteractionDto | null)
    code: AppCodes
    __typename: 'InteractionOutputDto'
}

export type join__Graph = 'AUTH' | 'POSTS' | 'SEARCH' | 'SOCIAL'

export type link__Purpose = 'SECURITY' | 'EXECUTION'

export interface Mutation {
    createUser: UserOutputDto
    createSession: SessionOutputDto
    loginUser: UserOutputDto
    closeAllOpenSessionByUserId: BooleanOutputDto
    closeSessionBySessionId: BooleanOutputDto
    createPost: PostOutputDto
    archivePost: BooleanOutputDto
    follow: UserCountsDto
    unfollow: UserCountsDto
    likePost: InteractionOutputDto
    unlikePost: BooleanOutputDto
    __typename: 'Mutation'
}

export interface NumberOutputDto {
    data: (Scalars['Int'] | null)
    code: AppCodes
    __typename: 'NumberOutputDto'
}

export interface PaginationMeta {
    total: Scalars['Int']
    page: Scalars['Int']
    lastPage: Scalars['Int']
    take: Scalars['Int']
    __typename: 'PaginationMeta'
}

export interface PostListOutputDto {
    data: (PostOutputData | null)
    code: AppCodes
    __typename: 'PostListOutputDto'
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

export interface PostOutputData {
    items: PostOutput[]
    meta: PaginationMeta
    __typename: 'PostOutputData'
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
    findPostById: PostOutputDto
    findPostsByUserId: PostListOutputDto
    searchPosts: SearchPostOutputDto
    searchUsers: SearchUserOutputDto
    searchTags: SearchUserOutputDto
    userCounts: UserCountsDto
    postLikeCount: NumberOutputDto
    hasUserLikedPost: BooleanOutputDto
    __typename: 'Query'
}

export interface SearchPostHitDto {
    postId: Scalars['Int']
    title: Scalars['String']
    content: (Scalars['String'] | null)
    userId: Scalars['Int']
    score: Scalars['Float']
    __typename: 'SearchPostHitDto'
}

export interface SearchPostHitDtoData {
    items: SearchPostHitDto[]
    meta: PaginationMeta
    __typename: 'SearchPostHitDtoData'
}

export interface SearchPostOutputDto {
    data: (SearchPostHitDtoData | null)
    code: AppCodes
    __typename: 'SearchPostOutputDto'
}

export interface SearchUserHitDto {
    userId: Scalars['Int']
    username: Scalars['String']
    displayName: (Scalars['String'] | null)
    score: Scalars['Float']
    __typename: 'SearchUserHitDto'
}

export interface SearchUserHitDtoData {
    items: SearchUserHitDto[]
    meta: PaginationMeta
    __typename: 'SearchUserHitDtoData'
}

export interface SearchUserOutputDto {
    data: (SearchUserHitDtoData | null)
    code: AppCodes
    __typename: 'SearchUserOutputDto'
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

export interface UserCountsDto {
    data: (FollowerFollowingCountDto | null)
    code: AppCodes
    __typename: 'UserCountsDto'
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

export interface FollowerFollowingCountDtoGenqlSelection{
    followers?: boolean | number
    followings?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FollowUnfollowInput {followerId: Scalars['Int'],followingId: Scalars['Int']}

export interface InteractionDtoGenqlSelection{
    id?: boolean | number
    userId?: boolean | number
    postId?: boolean | number
    createdAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface InteractionOutputDtoGenqlSelection{
    data?: InteractionDtoGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LikeInput {userId: Scalars['Int'],postId: Scalars['Int']}

export interface LoginUserInput {email: Scalars['String'],password: Scalars['String']}

export interface MutationGenqlSelection{
    createUser?: (UserOutputDtoGenqlSelection & { __args: {input: CreateUserInput} })
    createSession?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    loginUser?: (UserOutputDtoGenqlSelection & { __args: {input: LoginUserInput} })
    closeAllOpenSessionByUserId?: (BooleanOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    closeSessionBySessionId?: (BooleanOutputDtoGenqlSelection & { __args: {guid: Scalars['String']} })
    createPost?: (PostOutputDtoGenqlSelection & { __args: {input: CreatePostInput} })
    archivePost?: (BooleanOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    follow?: (UserCountsDtoGenqlSelection & { __args: {input: FollowUnfollowInput} })
    unfollow?: (UserCountsDtoGenqlSelection & { __args: {input: FollowUnfollowInput} })
    likePost?: (InteractionOutputDtoGenqlSelection & { __args: {input: LikeInput} })
    unlikePost?: (BooleanOutputDtoGenqlSelection & { __args: {input: LikeInput} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface NumberOutputDtoGenqlSelection{
    data?: boolean | number
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PaginationMetaGenqlSelection{
    total?: boolean | number
    page?: boolean | number
    lastPage?: boolean | number
    take?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostListOutputDtoGenqlSelection{
    data?: PostOutputDataGenqlSelection
    code?: boolean | number
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

export interface PostOutputDataGenqlSelection{
    items?: PostOutputGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostOutputDtoGenqlSelection{
    data?: PostOutputGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostsPaginationInput {userId: Scalars['Int'],take?: Scalars['Int'],page?: Scalars['Int'],status?: PostStatusEnum}

export interface QueryGenqlSelection{
    findUserById?: (UserOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findOpenSessionByGuid?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['String']} })
    findPostById?: (PostOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findPostsByUserId?: (PostListOutputDtoGenqlSelection & { __args: {input: PostsPaginationInput} })
    searchPosts?: (SearchPostOutputDtoGenqlSelection & { __args: {query: Scalars['String'], page?: (Scalars['Int'] | null), take?: (Scalars['Int'] | null)} })
    searchUsers?: (SearchUserOutputDtoGenqlSelection & { __args: {query: Scalars['String'], page?: (Scalars['Int'] | null), take?: (Scalars['Int'] | null)} })
    searchTags?: (SearchUserOutputDtoGenqlSelection & { __args: {query: Scalars['String'], page?: (Scalars['Int'] | null), take?: (Scalars['Int'] | null)} })
    userCounts?: (UserCountsDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    postLikeCount?: (NumberOutputDtoGenqlSelection & { __args: {postId: Scalars['Int']} })
    hasUserLikedPost?: (BooleanOutputDtoGenqlSelection & { __args: {userId: Scalars['Int'], postId: Scalars['Int']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchPostHitDtoGenqlSelection{
    postId?: boolean | number
    title?: boolean | number
    content?: boolean | number
    userId?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchPostHitDtoDataGenqlSelection{
    items?: SearchPostHitDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchPostOutputDtoGenqlSelection{
    data?: SearchPostHitDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchUserHitDtoGenqlSelection{
    userId?: boolean | number
    username?: boolean | number
    displayName?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchUserHitDtoDataGenqlSelection{
    items?: SearchUserHitDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchUserOutputDtoGenqlSelection{
    data?: SearchUserHitDtoDataGenqlSelection
    code?: boolean | number
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

export interface UserCountsDtoGenqlSelection{
    data?: FollowerFollowingCountDtoGenqlSelection
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
    


    const FollowerFollowingCountDto_possibleTypes: string[] = ['FollowerFollowingCountDto']
    export const isFollowerFollowingCountDto = (obj?: { __typename?: any } | null): obj is FollowerFollowingCountDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFollowerFollowingCountDto"')
      return FollowerFollowingCountDto_possibleTypes.includes(obj.__typename)
    }
    


    const InteractionDto_possibleTypes: string[] = ['InteractionDto']
    export const isInteractionDto = (obj?: { __typename?: any } | null): obj is InteractionDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInteractionDto"')
      return InteractionDto_possibleTypes.includes(obj.__typename)
    }
    


    const InteractionOutputDto_possibleTypes: string[] = ['InteractionOutputDto']
    export const isInteractionOutputDto = (obj?: { __typename?: any } | null): obj is InteractionOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isInteractionOutputDto"')
      return InteractionOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const NumberOutputDto_possibleTypes: string[] = ['NumberOutputDto']
    export const isNumberOutputDto = (obj?: { __typename?: any } | null): obj is NumberOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isNumberOutputDto"')
      return NumberOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const PaginationMeta_possibleTypes: string[] = ['PaginationMeta']
    export const isPaginationMeta = (obj?: { __typename?: any } | null): obj is PaginationMeta => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPaginationMeta"')
      return PaginationMeta_possibleTypes.includes(obj.__typename)
    }
    


    const PostListOutputDto_possibleTypes: string[] = ['PostListOutputDto']
    export const isPostListOutputDto = (obj?: { __typename?: any } | null): obj is PostListOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostListOutputDto"')
      return PostListOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const PostOutput_possibleTypes: string[] = ['PostOutput']
    export const isPostOutput = (obj?: { __typename?: any } | null): obj is PostOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostOutput"')
      return PostOutput_possibleTypes.includes(obj.__typename)
    }
    


    const PostOutputData_possibleTypes: string[] = ['PostOutputData']
    export const isPostOutputData = (obj?: { __typename?: any } | null): obj is PostOutputData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostOutputData"')
      return PostOutputData_possibleTypes.includes(obj.__typename)
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
    


    const SearchPostHitDto_possibleTypes: string[] = ['SearchPostHitDto']
    export const isSearchPostHitDto = (obj?: { __typename?: any } | null): obj is SearchPostHitDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchPostHitDto"')
      return SearchPostHitDto_possibleTypes.includes(obj.__typename)
    }
    


    const SearchPostHitDtoData_possibleTypes: string[] = ['SearchPostHitDtoData']
    export const isSearchPostHitDtoData = (obj?: { __typename?: any } | null): obj is SearchPostHitDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchPostHitDtoData"')
      return SearchPostHitDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const SearchPostOutputDto_possibleTypes: string[] = ['SearchPostOutputDto']
    export const isSearchPostOutputDto = (obj?: { __typename?: any } | null): obj is SearchPostOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchPostOutputDto"')
      return SearchPostOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const SearchUserHitDto_possibleTypes: string[] = ['SearchUserHitDto']
    export const isSearchUserHitDto = (obj?: { __typename?: any } | null): obj is SearchUserHitDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchUserHitDto"')
      return SearchUserHitDto_possibleTypes.includes(obj.__typename)
    }
    


    const SearchUserHitDtoData_possibleTypes: string[] = ['SearchUserHitDtoData']
    export const isSearchUserHitDtoData = (obj?: { __typename?: any } | null): obj is SearchUserHitDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchUserHitDtoData"')
      return SearchUserHitDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const SearchUserOutputDto_possibleTypes: string[] = ['SearchUserOutputDto']
    export const isSearchUserOutputDto = (obj?: { __typename?: any } | null): obj is SearchUserOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchUserOutputDto"')
      return SearchUserOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const UserCountsDto_possibleTypes: string[] = ['UserCountsDto']
    export const isUserCountsDto = (obj?: { __typename?: any } | null): obj is UserCountsDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserCountsDto"')
      return UserCountsDto_possibleTypes.includes(obj.__typename)
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
   OK_CREATED: 'OK_CREATED' as const,
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
   POSTS: 'POSTS' as const,
   SEARCH: 'SEARCH' as const,
   SOCIAL: 'SOCIAL' as const
}

export const enumLinkPurpose = {
   SECURITY: 'SECURITY' as const,
   EXECUTION: 'EXECUTION' as const
}

export const enumPostStatusEnum = {
   ACTIVE: 'ACTIVE' as const,
   ARCHIVED: 'ARCHIVED' as const
}
