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
        21,
        23,
        24,
        28,
        29
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
                33
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
                62
            ],
            "after": [
                62
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
                21
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
                25
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
                57,
                {
                    "input": [
                        14,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                54,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                57,
                {
                    "input": [
                        30,
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
                37,
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
                55,
                {
                    "input": [
                        22,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                55,
                {
                    "input": [
                        22,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                27,
                {
                    "input": [
                        26,
                        "LikeInput!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "input": [
                        26,
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
                36
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
                35
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "PostOutputDto": {
            "data": [
                35
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
                57,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                54,
                {
                    "id": [
                        7,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                37,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                34,
                {
                    "input": [
                        39,
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
                46,
                {
                    "input": [
                        43,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                52,
                {
                    "input": [
                        43,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                49,
                {
                    "input": [
                        43,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                55,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "postLikeCount": [
                32,
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
                42,
                {
                    "input": [
                        19,
                        "FeedInput!"
                    ]
                }
            ],
            "postRecommendation": [
                42,
                {
                    "input": [
                        38,
                        "PostRecommendationInput!"
                    ]
                }
            ],
            "userRecommendation": [
                61,
                {
                    "input": [
                        58,
                        "UserRecommendationInput!"
                    ]
                }
            ],
            "__typename": [
                7
            ]
        },
        "ScoredPostItemDtoData": {
            "items": [
                35
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "ScoredPostOutputDto": {
            "data": [
                41
            ],
            "code": [
                0
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
                44
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "SearchPostOutputDto": {
            "data": [
                45
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
                47
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "SearchTagOutputDto": {
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
                50
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "SearchUserOutputDto": {
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
                53
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
                20
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
                56
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
                59
            ],
            "meta": [
                33
            ],
            "__typename": [
                7
            ]
        },
        "UserRecommendationOutputDto": {
            "data": [
                60
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