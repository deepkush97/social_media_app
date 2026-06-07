// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    Boolean: boolean,
    Int: number,
    String: string,
    DateTime: any,
    Float: number,
    join__FieldSet: any,
    link__Import: any,
}

export type AppCodes = 'OPERATION_SUCCESS' | 'INVALID_CREDENTIALS' | 'INVALID_EMAIL' | 'INTERNAL_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'USER_CREATED' | 'OK_CREATED' | 'BAD_REQUEST' | 'URL_CREATED' | 'URL_NOT_FOUND' | 'NOT_FOUND'

export type AuthSessionEnum = 'OPEN' | 'CLOSED'

export interface BooleanOutputDto {
    data: (Scalars['Boolean'] | null)
    code: AppCodes
    __typename: 'BooleanOutputDto'
}

export interface CommentListOutputDto {
    data: (CommentOutputData | null)
    code: AppCodes
    __typename: 'CommentListOutputDto'
}

export interface CommentOutput {
    id: Scalars['Int']
    postId: Scalars['Int']
    userId: Scalars['Int']
    parentId: (Scalars['Int'] | null)
    content: Scalars['String']
    status: ContentStatusEnum
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
    __typename: 'CommentOutput'
}

export interface CommentOutputData {
    items: CommentOutput[]
    meta: PaginationMeta
    __typename: 'CommentOutputData'
}

export interface CommentOutputDto {
    data: (CommentOutput | null)
    code: AppCodes
    __typename: 'CommentOutputDto'
}

export type ContentStatusEnum = 'ACTIVE' | 'ARCHIVED'

export interface DecayResultDto {
    edgesDecayed: Scalars['Float']
    before: WeightSnapshotDto
    after: WeightSnapshotDto
    __typename: 'DecayResultDto'
}

export interface DecayResultOutputDto {
    data: (DecayResultDto | null)
    code: AppCodes
    __typename: 'DecayResultOutputDto'
}

export interface FeedItemDto {
    postId: Scalars['Int']
    score: Scalars['Float']
    __typename: 'FeedItemDto'
}

export interface FeedItemDtoData {
    items: FeedItemDto[]
    meta: PaginationMeta
    __typename: 'FeedItemDtoData'
}

export interface FeedOutputDto {
    data: (FeedItemDtoData | null)
    code: AppCodes
    __typename: 'FeedOutputDto'
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
    createComment: CommentOutputDto
    archiveComment: BooleanOutputDto
    follow: UserCountsDto
    unfollow: UserCountsDto
    likePost: LikeOutputDto
    unlikePost: BooleanOutputDto
    triggerWeightDecay: DecayResultOutputDto
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
    status: ContentStatusEnum
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

export interface PostRecommendationItemDto {
    postId: Scalars['Int']
    score: Scalars['Float']
    __typename: 'PostRecommendationItemDto'
}

export interface PostRecommendationItemDtoData {
    items: PostRecommendationItemDto[]
    meta: PaginationMeta
    __typename: 'PostRecommendationItemDtoData'
}

export interface PostRecommendationOutputDto {
    data: (PostRecommendationItemDtoData | null)
    code: AppCodes
    __typename: 'PostRecommendationOutputDto'
}

export interface Query {
    findUserById: UserOutputDto
    findOpenSessionByGuid: SessionOutputDto
    findPostById: PostOutputDto
    findPostsByUserId: PostListOutputDto
    findCommentById: CommentOutputDto
    findCommentsByPostId: CommentListOutputDto
    searchPosts: SearchPostOutputDto
    searchUsers: SearchUserOutputDto
    searchTags: SearchTagOutputDto
    userCounts: UserCountsDto
    postLikeCount: NumberOutputDto
    hasUserLikedPost: BooleanOutputDto
    feed: FeedOutputDto
    postRecommendation: PostRecommendationOutputDto
    userRecommendation: UserRecommendationOutputDto
    __typename: 'Query'
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

export interface UserRecommendationItemDto {
    userId: Scalars['Int']
    commonFollowers: Scalars['Int']
    likedPostsScore: Scalars['Int']
    score: Scalars['Float']
    __typename: 'UserRecommendationItemDto'
}

export interface UserRecommendationItemDtoData {
    items: UserRecommendationItemDto[]
    meta: PaginationMeta
    __typename: 'UserRecommendationItemDtoData'
}

export interface UserRecommendationOutputDto {
    data: (UserRecommendationItemDtoData | null)
    code: AppCodes
    __typename: 'UserRecommendationOutputDto'
}

export interface WeightSnapshotDto {
    min: Scalars['Float']
    max: Scalars['Float']
    mean: Scalars['Float']
    __typename: 'WeightSnapshotDto'
}

export interface BooleanOutputDtoGenqlSelection{
    data?: boolean | number
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CommentListOutputDtoGenqlSelection{
    data?: CommentOutputDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CommentOutputGenqlSelection{
    id?: boolean | number
    postId?: boolean | number
    userId?: boolean | number
    parentId?: boolean | number
    content?: boolean | number
    status?: boolean | number
    createdAt?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CommentOutputDataGenqlSelection{
    items?: CommentOutputGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CommentOutputDtoGenqlSelection{
    data?: CommentOutputGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CommentsPaginationInput {take?: Scalars['Int'],page?: Scalars['Int'],postId: Scalars['Int'],status?: ContentStatusEnum}

export interface CreateCommentInput {postId: Scalars['Int'],content: Scalars['String'],parentId?: (Scalars['Int'] | null),userId: Scalars['Int']}

export interface CreatePostInput {title: Scalars['String'],content: Scalars['String'],image?: (Scalars['String'] | null),userId: Scalars['Int']}

export interface CreateUserInput {name: Scalars['String'],email: Scalars['String'],password: Scalars['String']}

export interface DecayResultDtoGenqlSelection{
    edgesDecayed?: boolean | number
    before?: WeightSnapshotDtoGenqlSelection
    after?: WeightSnapshotDtoGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface DecayResultOutputDtoGenqlSelection{
    data?: DecayResultDtoGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FeedInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int']}

export interface FeedItemDtoGenqlSelection{
    postId?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FeedItemDtoDataGenqlSelection{
    items?: FeedItemDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface FeedOutputDtoGenqlSelection{
    data?: FeedItemDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

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
    createComment?: (CommentOutputDtoGenqlSelection & { __args: {input: CreateCommentInput} })
    archiveComment?: (BooleanOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    follow?: (UserCountsDtoGenqlSelection & { __args: {input: FollowUnfollowInput} })
    unfollow?: (UserCountsDtoGenqlSelection & { __args: {input: FollowUnfollowInput} })
    likePost?: (LikeOutputDtoGenqlSelection & { __args: {input: LikeInput} })
    unlikePost?: (BooleanOutputDtoGenqlSelection & { __args: {input: LikeInput} })
    triggerWeightDecay?: (DecayResultOutputDtoGenqlSelection & { __args?: {dryRun?: (Scalars['Boolean'] | null)} })
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

export interface PostRecommendationInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int']}

export interface PostRecommendationItemDtoGenqlSelection{
    postId?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostRecommendationItemDtoDataGenqlSelection{
    items?: PostRecommendationItemDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostRecommendationOutputDtoGenqlSelection{
    data?: PostRecommendationItemDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostsPaginationInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int'],status?: ContentStatusEnum}

export interface QueryGenqlSelection{
    findUserById?: (UserOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findOpenSessionByGuid?: (SessionOutputDtoGenqlSelection & { __args: {id: Scalars['String']} })
    findPostById?: (PostOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findPostsByUserId?: (PostListOutputDtoGenqlSelection & { __args: {input: PostsPaginationInput} })
    findCommentById?: (CommentOutputDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    findCommentsByPostId?: (CommentListOutputDtoGenqlSelection & { __args: {input: CommentsPaginationInput} })
    searchPosts?: (SearchPostOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    searchUsers?: (SearchUserOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    searchTags?: (SearchTagOutputDtoGenqlSelection & { __args: {input: SearchInput} })
    userCounts?: (UserCountsDtoGenqlSelection & { __args: {id: Scalars['Int']} })
    postLikeCount?: (NumberOutputDtoGenqlSelection & { __args: {postId: Scalars['Int']} })
    hasUserLikedPost?: (BooleanOutputDtoGenqlSelection & { __args: {userId: Scalars['Int'], postId: Scalars['Int']} })
    feed?: (FeedOutputDtoGenqlSelection & { __args: {input: FeedInput} })
    postRecommendation?: (PostRecommendationOutputDtoGenqlSelection & { __args: {input: PostRecommendationInput} })
    userRecommendation?: (UserRecommendationOutputDtoGenqlSelection & { __args: {input: UserRecommendationInput} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

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

export interface UserRecommendationInput {take?: Scalars['Int'],page?: Scalars['Int'],userId: Scalars['Int']}

export interface UserRecommendationItemDtoGenqlSelection{
    userId?: boolean | number
    commonFollowers?: boolean | number
    likedPostsScore?: boolean | number
    score?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserRecommendationItemDtoDataGenqlSelection{
    items?: UserRecommendationItemDtoGenqlSelection
    meta?: PaginationMetaGenqlSelection
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserRecommendationOutputDtoGenqlSelection{
    data?: UserRecommendationItemDtoDataGenqlSelection
    code?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface WeightSnapshotDtoGenqlSelection{
    min?: boolean | number
    max?: boolean | number
    mean?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const BooleanOutputDto_possibleTypes: string[] = ['BooleanOutputDto']
    export const isBooleanOutputDto = (obj?: { __typename?: any } | null): obj is BooleanOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isBooleanOutputDto"')
      return BooleanOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const CommentListOutputDto_possibleTypes: string[] = ['CommentListOutputDto']
    export const isCommentListOutputDto = (obj?: { __typename?: any } | null): obj is CommentListOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCommentListOutputDto"')
      return CommentListOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const CommentOutput_possibleTypes: string[] = ['CommentOutput']
    export const isCommentOutput = (obj?: { __typename?: any } | null): obj is CommentOutput => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCommentOutput"')
      return CommentOutput_possibleTypes.includes(obj.__typename)
    }
    


    const CommentOutputData_possibleTypes: string[] = ['CommentOutputData']
    export const isCommentOutputData = (obj?: { __typename?: any } | null): obj is CommentOutputData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCommentOutputData"')
      return CommentOutputData_possibleTypes.includes(obj.__typename)
    }
    


    const CommentOutputDto_possibleTypes: string[] = ['CommentOutputDto']
    export const isCommentOutputDto = (obj?: { __typename?: any } | null): obj is CommentOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCommentOutputDto"')
      return CommentOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const DecayResultDto_possibleTypes: string[] = ['DecayResultDto']
    export const isDecayResultDto = (obj?: { __typename?: any } | null): obj is DecayResultDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDecayResultDto"')
      return DecayResultDto_possibleTypes.includes(obj.__typename)
    }
    


    const DecayResultOutputDto_possibleTypes: string[] = ['DecayResultOutputDto']
    export const isDecayResultOutputDto = (obj?: { __typename?: any } | null): obj is DecayResultOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isDecayResultOutputDto"')
      return DecayResultOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const FeedItemDto_possibleTypes: string[] = ['FeedItemDto']
    export const isFeedItemDto = (obj?: { __typename?: any } | null): obj is FeedItemDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFeedItemDto"')
      return FeedItemDto_possibleTypes.includes(obj.__typename)
    }
    


    const FeedItemDtoData_possibleTypes: string[] = ['FeedItemDtoData']
    export const isFeedItemDtoData = (obj?: { __typename?: any } | null): obj is FeedItemDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFeedItemDtoData"')
      return FeedItemDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const FeedOutputDto_possibleTypes: string[] = ['FeedOutputDto']
    export const isFeedOutputDto = (obj?: { __typename?: any } | null): obj is FeedOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isFeedOutputDto"')
      return FeedOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const PostRecommendationItemDto_possibleTypes: string[] = ['PostRecommendationItemDto']
    export const isPostRecommendationItemDto = (obj?: { __typename?: any } | null): obj is PostRecommendationItemDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostRecommendationItemDto"')
      return PostRecommendationItemDto_possibleTypes.includes(obj.__typename)
    }
    


    const PostRecommendationItemDtoData_possibleTypes: string[] = ['PostRecommendationItemDtoData']
    export const isPostRecommendationItemDtoData = (obj?: { __typename?: any } | null): obj is PostRecommendationItemDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostRecommendationItemDtoData"')
      return PostRecommendationItemDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const PostRecommendationOutputDto_possibleTypes: string[] = ['PostRecommendationOutputDto']
    export const isPostRecommendationOutputDto = (obj?: { __typename?: any } | null): obj is PostRecommendationOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isPostRecommendationOutputDto"')
      return PostRecommendationOutputDto_possibleTypes.includes(obj.__typename)
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
    


    const UserRecommendationItemDto_possibleTypes: string[] = ['UserRecommendationItemDto']
    export const isUserRecommendationItemDto = (obj?: { __typename?: any } | null): obj is UserRecommendationItemDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserRecommendationItemDto"')
      return UserRecommendationItemDto_possibleTypes.includes(obj.__typename)
    }
    


    const UserRecommendationItemDtoData_possibleTypes: string[] = ['UserRecommendationItemDtoData']
    export const isUserRecommendationItemDtoData = (obj?: { __typename?: any } | null): obj is UserRecommendationItemDtoData => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserRecommendationItemDtoData"')
      return UserRecommendationItemDtoData_possibleTypes.includes(obj.__typename)
    }
    


    const UserRecommendationOutputDto_possibleTypes: string[] = ['UserRecommendationOutputDto']
    export const isUserRecommendationOutputDto = (obj?: { __typename?: any } | null): obj is UserRecommendationOutputDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUserRecommendationOutputDto"')
      return UserRecommendationOutputDto_possibleTypes.includes(obj.__typename)
    }
    


    const WeightSnapshotDto_possibleTypes: string[] = ['WeightSnapshotDto']
    export const isWeightSnapshotDto = (obj?: { __typename?: any } | null): obj is WeightSnapshotDto => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isWeightSnapshotDto"')
      return WeightSnapshotDto_possibleTypes.includes(obj.__typename)
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

export const enumContentStatusEnum = {
   ACTIVE: 'ACTIVE' as const,
   ARCHIVED: 'ARCHIVED' as const
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
