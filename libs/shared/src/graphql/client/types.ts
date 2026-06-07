export default {
    "scalars": [
        0,
        1,
        3,
        6,
        7,
        11,
        15,
        17,
        23,
        25,
        26,
        30,
        31
    ],
    "types": {
        "AppCodes": {},
        "AuthSessionEnum": {},
        "BooleanOutputDto": {
            "data": [
                3
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "Boolean": {},
        "CommentListOutputDto": {
            "data": [
                8
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "CommentOutput": {
            "id": [
                6
            ],
            "postId": [
                6
            ],
            "userId": [
                6
            ],
            "parentId": [
                6
            ],
            "content": [
                7
            ],
            "status": [
                11
            ],
            "createdAt": [
                15
            ],
            "updatedAt": [
                15
            ],
            "__typename": [
                7
            ]
        },
        "Int": {},
        "String": {},
        "CommentOutputData": {
            "items": [
                5
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "CommentOutputDto": {
            "data": [
                5
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "CommentsPaginationInput": {
            "take": [
                6
            ],
            "page": [
                6
            ],
            "postId": [
                6
            ],
            "status": [
                11
            ],
            "__typename": [
                7
            ]
        },
        "ContentStatusEnum": {},
        "CreateCommentInput": {
            "postId": [
                6
            ],
            "content": [
                7
            ],
            "parentId": [
                6
            ],
            "userId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "CreatePostInput": {
            "title": [
                7
            ],
            "content": [
                7
            ],
            "image": [
                7
            ],
            "userId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "CreateUserInput": {
            "name": [
                7
            ],
            "email": [
                7
            ],
            "password": [
                7
            ],
            "__typename": [
                7
            ]
        },
        "DateTime": {},
        "DecayResultDto": {
            "edgesDecayed": [
                17
            ],
            "before": [
                65
            ],
            "after": [
                65
            ],
            "__typename": [
                7
            ]
        },
        "Float": {},
        "DecayResultOutputDto": {
            "data": [
                16
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "FeedInput": {
            "take": [
                6
            ],
            "page": [
                6
            ],
            "userId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "FeedItemDtoData": {
            "items": [
                37
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "FeedOutputDto": {
            "data": [
                20
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "FollowerFollowingCountDto": {
            "followers": [
                6
            ],
            "followings": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "FollowSource": {},
        "FollowUnfollowInput": {
            "followerId": [
                6
            ],
            "followingId": [
                6
            ],
            "source": [
                23
            ],
            "__typename": [
                7
            ]
        },
        "join__FieldSet": {},
        "join__Graph": {},
        "LikeDto": {
            "id": [
                6
            ],
            "userId": [
                6
            ],
            "postId": [
                6
            ],
            "createdAt": [
                15
            ],
            "updatedAt": [
                15
            ],
            "__typename": [
                7
            ]
        },
        "LikeInput": {
            "userId": [
                6
            ],
            "postId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "LikeOutputDto": {
            "data": [
                27
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "link__Import": {},
        "link__Purpose": {},
        "LoginUserInput": {
            "email": [
                7
            ],
            "password": [
                7
            ],
            "__typename": [
                7
            ]
        },
        "Mutation": {
            "createUser": [
                60,
                {
                    "input": [
                        14,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                57,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                60,
                {
                    "input": [
                        32,
                        "LoginUserInput!"
                    ]
                }
            ],
            "closeAllOpenSessionByUserId": [
                2,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "closeSessionBySessionId": [
                2,
                {
                    "guid": [
                        7,
                        "String!"
                    ]
                }
            ],
            "createPost": [
                39,
                {
                    "input": [
                        13,
                        "CreatePostInput!"
                    ]
                }
            ],
            "archivePost": [
                2,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "createComment": [
                9,
                {
                    "input": [
                        12,
                        "CreateCommentInput!"
                    ]
                }
            ],
            "archiveComment": [
                2,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "follow": [
                58,
                {
                    "input": [
                        24,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                58,
                {
                    "input": [
                        24,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                29,
                {
                    "input": [
                        28,
                        "LikeInput!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "input": [
                        28,
                        "LikeInput!"
                    ]
                }
            ],
            "triggerWeightDecay": [
                18,
                {
                    "dryRun": [
                        3
                    ]
                }
            ],
            "__typename": [
                7
            ]
        },
        "NumberOutputDto": {
            "data": [
                6
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "PaginationMeta": {
            "total": [
                6
            ],
            "page": [
                6
            ],
            "lastPage": [
                6
            ],
            "take": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "PostListOutputDto": {
            "data": [
                38
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "PostOutput": {
            "id": [
                6
            ],
            "title": [
                7
            ],
            "content": [
                7
            ],
            "image": [
                7
            ],
            "tags": [
                7
            ],
            "userId": [
                6
            ],
            "status": [
                11
            ],
            "createdAt": [
                15
            ],
            "updatedAt": [
                15
            ],
            "score": [
                17
            ],
            "__typename": [
                7
            ]
        },
        "PostOutputData": {
            "items": [
                37
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "PostOutputDto": {
            "data": [
                37
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "PostRecommendationInput": {
            "take": [
                6
            ],
            "page": [
                6
            ],
            "userId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "PostRecommendationItemDto": {
            "id": [
                6
            ],
            "score": [
                17
            ],
            "__typename": [
                7
            ]
        },
        "PostRecommendationItemDtoData": {
            "items": [
                41
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "PostRecommendationOutputDto": {
            "data": [
                42
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "PostsPaginationInput": {
            "take": [
                6
            ],
            "page": [
                6
            ],
            "userId": [
                6
            ],
            "status": [
                11
            ],
            "__typename": [
                7
            ]
        },
        "Query": {
            "findUserById": [
                60,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                57,
                {
                    "id": [
                        7,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                39,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                36,
                {
                    "input": [
                        44,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "findCommentById": [
                9,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findCommentsByPostId": [
                4,
                {
                    "input": [
                        10,
                        "CommentsPaginationInput!"
                    ]
                }
            ],
            "searchPosts": [
                49,
                {
                    "input": [
                        46,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                55,
                {
                    "input": [
                        46,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                52,
                {
                    "input": [
                        46,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                58,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "postLikeCount": [
                34,
                {
                    "postId": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "hasUserLikedPost": [
                2,
                {
                    "userId": [
                        6,
                        "Int!"
                    ],
                    "postId": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "feed": [
                21,
                {
                    "input": [
                        19,
                        "FeedInput!"
                    ]
                }
            ],
            "postRecommendation": [
                43,
                {
                    "input": [
                        40,
                        "PostRecommendationInput!"
                    ]
                }
            ],
            "userRecommendation": [
                64,
                {
                    "input": [
                        61,
                        "UserRecommendationInput!"
                    ]
                }
            ],
            "__typename": [
                7
            ]
        },
        "SearchInput": {
            "query": [
                7
            ],
            "page": [
                6
            ],
            "take": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "SearchPostHitDto": {
            "id": [
                6
            ],
            "title": [
                7
            ],
            "content": [
                7
            ],
            "userId": [
                6
            ],
            "score": [
                17
            ],
            "tags": [
                7
            ],
            "__typename": [
                7
            ]
        },
        "SearchPostHitDtoData": {
            "items": [
                47
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "SearchPostOutputDto": {
            "data": [
                48
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "SearchTagHitDto": {
            "id": [
                7
            ],
            "name": [
                7
            ],
            "score": [
                17
            ],
            "__typename": [
                7
            ]
        },
        "SearchTagHitDtoData": {
            "items": [
                50
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "SearchTagOutputDto": {
            "data": [
                51
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "SearchUserHitDto": {
            "id": [
                6
            ],
            "email": [
                7
            ],
            "name": [
                7
            ],
            "score": [
                17
            ],
            "__typename": [
                7
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                53
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "SearchUserOutputDto": {
            "data": [
                54
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "SessionOutput": {
            "id": [
                6
            ],
            "guid": [
                7
            ],
            "userId": [
                6
            ],
            "status": [
                1
            ],
            "createdAt": [
                15
            ],
            "updatedAt": [
                15
            ],
            "__typename": [
                7
            ]
        },
        "SessionOutputDto": {
            "data": [
                56
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "UserCountsDto": {
            "data": [
                22
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "UserOutput": {
            "id": [
                6
            ],
            "name": [
                7
            ],
            "email": [
                7
            ],
            "createdAt": [
                15
            ],
            "updatedAt": [
                15
            ],
            "__typename": [
                7
            ]
        },
        "UserOutputDto": {
            "data": [
                59
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "UserRecommendationInput": {
            "take": [
                6
            ],
            "page": [
                6
            ],
            "userId": [
                6
            ],
            "__typename": [
                7
            ]
        },
        "UserRecommendationItemDto": {
            "userId": [
                6
            ],
            "commonFollowers": [
                6
            ],
            "likedPostsScore": [
                6
            ],
            "score": [
                17
            ],
            "__typename": [
                7
            ]
        },
        "UserRecommendationItemDtoData": {
            "items": [
                62
            ],
            "meta": [
                35
            ],
            "__typename": [
                7
            ]
        },
        "UserRecommendationOutputDto": {
            "data": [
                63
            ],
            "code": [
                0
            ],
            "__typename": [
                7
            ]
        },
        "WeightSnapshotDto": {
            "min": [
                17
            ],
            "max": [
                17
            ],
            "mean": [
                17
            ],
            "__typename": [
                7
            ]
        }
    }
}