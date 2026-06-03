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

export type FollowSource = 'search' | 'suggested' | 'profile' | 'feed'

export type join__Graph = 'AUTH' | 'POSTS' | 'SEARCH' | 'SOCIAL'

export interface LikeDto {
    id: Scalars['Int']
    userId: Scalars['Int']
    postId: Scalars['Int']
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
    __typename: 'LikeDto'
}

export interface LikeOutputDto {
    data: (LikeDto | null)
    code: AppCodes
    __typename: 'LikeOutputDto'
}

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
    likePost: LikeOutputDto
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
    tags: Scalars['String'][]
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
    searchTags: SearchTagOutputDto
    userCounts: UserCountsDto
    postLikeCount: NumberOutputDto
    hasUserLikedPost: BooleanOutputDto
    recommendedPosts: RecommendedPostOutputDto
    whoToFollow: WhoToFollowOutputDto
    __typename: 'Query'
}

export interface RecommendedPostDto {
    postId: Scalars['Int']
    score: Scalars['Float']
    __typename: 'RecommendedPostDto'
}

export interface RecommendedPostDtoData {
    items: RecommendedPostDto[]
    meta: PaginationMeta
    __typename: 'RecommendedPostDtoData'
}

export interface RecommendedPostOutputDto {
    data: (RecommendedPostDtoData | null)
    code: AppCodes
    __typename: 'RecommendedPostOutputDto'
}

export interface SearchPostHitDto {
    id: Scalars['Int']
    title: Scalars['String']
    content: (Scalars['String'] | null)
    userId: Scalars['Int']
    score: Scalars['Float']
    tags: (Scalars['String'][] | null)
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

export interface SearchTagHitDto {
    id: Scalars['String']
    name: Scalars['String']
    score: Scalars['Float']
    __typename: 'SearchTagHitDto'
}

export interface SearchTagHitDtoData {
    items: SearchTagHitDto[]
    meta: PaginationMeta
    __typename: 'SearchTagHitDtoData'
}

export interface SearchTagOutputDto {
    data: (SearchTagHitDtoData | null)
    code: AppCodes
    __typename: 'SearchTagOutputDto'
}

export interface SearchUserHitDto {
    id: Scalars['Int']
    email: Scalars['String']
    name: (Scalars['String'] | null)
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

export interface WhoToFollowOutputDto {
    data: (WhoToFollowUserDtoData | null)
    code: AppCodes
    __typename: 'WhoToFollowOutputDto'
}

export interface WhoToFollowUserDto {
    userId: Scalars['Int']
    commonFollowers: Scalars['Int']
    likedPostsScore: Scalars['Int']
    score: Scalars['Float']
    __typename: 'WhoToFollowUserDto'
}

export interface WhoToFollowUserDtoData {
    items: WhoToFollowUserDto[]
    meta: PaginationMeta
    __typename: 'WhoToFollowUserDtoData'
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

export interface FollowUnfollowInput {followerId: Scalars['Int'],followingId: Scalars['Int'],source?: (FollowSource | null)}

export interface LikeDtoGenqlSelection{
    id?: boolean | number
    userId?: boolean | number
    postId?: boolean | number
    createdAt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LikeInput {userId: Scalars['Int'],postId: Scalars['Int']}

export interface LikeOutputDtoGenqlSelection{
    data?: LikeDtoGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

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
    likePost?: (LikeOutputDtoGenqlSelection & { __args: {input: LikeInput} })
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
    tags?: boolean | number
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

export interface PostsPaginationInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int'],status?: PostStatusEnum}

export interface QueryGenqlSelection{
    findUserById?: (UserOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findOpenSessionByGuid?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['String']} })
    findPostById?: (PostOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findPostsByUserId?: (PostListOutputDtoGenqlSelection & { __args: {input: PostsPaginationInput} })
    searchPosts?: (SearchPostOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    searchUsers?: (SearchUserOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    searchTags?: (SearchTagOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    userCounts?: (UserCountsDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    postLikeCount?: (NumberOutputDtoGenqlSelection & { __args: {postId: Scalars['Int']} })
    hasUserLikedPost?: (BooleanOutputDtoGenqlSelection & { __args: {userId: Scalars['Int'], postId: Scalars['Int']} })
    recommendedPosts?: (RecommendedPostOutputDtoGenqlSelection & { __args: {input: RecommendedPostsInput} })
    whoToFollow?: (WhoToFollowOutputDtoGenqlSelection & { __args: {input: WhoToFollowInput} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RecommendedPostDtoGenqlSelection{
    postId?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RecommendedPostDtoDataGenqlSelection{
    items?: RecommendedPostDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RecommendedPostOutputDtoGenqlSelection{
    data?: RecommendedPostDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface RecommendedPostsInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int']}

export interface SearchInput {query: Scalars['String'],page?: (Scalars['Int'] | null),take?: (Scalars['Int'] | null)}

export interface SearchPostHitDtoGenqlSelection{
    id?: boolean | number
    title?: boolean | number
    content?: boolean | number
    userId?: boolean | number
    score?: boolean | number
    tags?: boolean | number
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

export interface SearchTagHitDtoGenqlSelection{
    id?: boolean | number
    name?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchTagHitDtoDataGenqlSelection{
    items?: SearchTagHitDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchTagOutputDtoGenqlSelection{
    data?: SearchTagHitDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SearchUserHitDtoGenqlSelection{
    id?: boolean | number
    email?: boolean | number
    name?: boolean | number
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

export interface WhoToFollowInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int']}

export interface WhoToFollowOutputDtoGenqlSelection{
    data?: WhoToFollowUserDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface WhoToFollowUserDtoGenqlSelection{
    userId?: boolean | number
    commonFollowers?: boolean | number
    likedPostsScore?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface WhoToFollowUserDtoDataGenqlSelection{
    items?: WhoToFollowUserDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
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
    


    const LikeDto_possibleTypes: string[] = ['LikeDto']
    export const isLikeDto = (obj?: { __typename?: any } | null): obj is LikeDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLikeDto"')
      return LikeDto_possibleTypes.includes(obj.__typename)
    }
    


    const LikeOutputDto_possibleTypes: string[] = ['LikeOutputDto']
    export const isLikeOutputDto = (obj?: { __typename?: any } | null): obj is LikeOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isLikeOutputDto"')
      return LikeOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const RecommendedPostDto_possibleTypes: string[] = ['RecommendedPostDto']
    export const isRecommendedPostDto = (obj?: { __typename?: any } | null): obj is RecommendedPostDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRecommendedPostDto"')
      return RecommendedPostDto_possibleTypes.includes(obj.__typename)
    }
    


    const RecommendedPostDtoData_possibleTypes: string[] = ['RecommendedPostDtoData']
    export const isRecommendedPostDtoData = (obj?: { __typename?: any } | null): obj is RecommendedPostDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRecommendedPostDtoData"')
      return RecommendedPostDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const RecommendedPostOutputDto_possibleTypes: string[] = ['RecommendedPostOutputDto']
    export const isRecommendedPostOutputDto = (obj?: { __typename?: any } | null): obj is RecommendedPostOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isRecommendedPostOutputDto"')
      return RecommendedPostOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const SearchTagHitDto_possibleTypes: string[] = ['SearchTagHitDto']
    export const isSearchTagHitDto = (obj?: { __typename?: any } | null): obj is SearchTagHitDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchTagHitDto"')
      return SearchTagHitDto_possibleTypes.includes(obj.__typename)
    }
    


    const SearchTagHitDtoData_possibleTypes: string[] = ['SearchTagHitDtoData']
    export const isSearchTagHitDtoData = (obj?: { __typename?: any } | null): obj is SearchTagHitDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchTagHitDtoData"')
      return SearchTagHitDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const SearchTagOutputDto_possibleTypes: string[] = ['SearchTagOutputDto']
    export const isSearchTagOutputDto = (obj?: { __typename?: any } | null): obj is SearchTagOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isSearchTagOutputDto"')
      return SearchTagOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const WhoToFollowOutputDto_possibleTypes: string[] = ['WhoToFollowOutputDto']
    export const isWhoToFollowOutputDto = (obj?: { __typename?: any } | null): obj is WhoToFollowOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWhoToFollowOutputDto"')
      return WhoToFollowOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const WhoToFollowUserDto_possibleTypes: string[] = ['WhoToFollowUserDto']
    export const isWhoToFollowUserDto = (obj?: { __typename?: any } | null): obj is WhoToFollowUserDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWhoToFollowUserDto"')
      return WhoToFollowUserDto_possibleTypes.includes(obj.__typename)
    }
    


    const WhoToFollowUserDtoData_possibleTypes: string[] = ['WhoToFollowUserDtoData']
    export const isWhoToFollowUserDtoData = (obj?: { __typename?: any } | null): obj is WhoToFollowUserDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWhoToFollowUserDtoData"')
      return WhoToFollowUserDtoData_possibleTypes.includes(obj.__typename)
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

export const enumFollowSource = {
   search: 'search' as const,
   suggested: 'suggested' as const,
   profile: 'profile' as const,
   feed: 'feed' as const
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
