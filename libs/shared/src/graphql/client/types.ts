export default {
    "scalars": [
        0,
        1,
        3,
        5,
        6,
        8,
        10,
        13,
        15,
        16,
        20,
        21,
        35
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
                5
            ]
        },
        "Boolean": {},
        "CreatePostInput": {
            "title": [
                5
            ],
            "content": [
                5
            ],
            "image": [
                5
            ],
            "userId": [
                6
            ],
            "__typename": [
                5
            ]
        },
        "String": {},
        "Int": {},
        "CreateUserInput": {
            "name": [
                5
            ],
            "email": [
                5
            ],
            "password": [
                5
            ],
            "__typename": [
                5
            ]
        },
        "DateTime": {},
        "DecayResultDto": {
            "edgesDecayed": [
                10
            ],
            "before": [
                56
            ],
            "after": [
                56
            ],
            "__typename": [
                5
            ]
        },
        "Float": {},
        "DecayResultOutputDto": {
            "data": [
                9
            ],
            "code": [
                0
            ],
            "__typename": [
                5
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
                5
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
                13
            ],
            "__typename": [
                5
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
                8
            ],
            "updatedAt": [
                8
            ],
            "__typename": [
                5
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
                5
            ]
        },
        "LikeOutputDto": {
            "data": [
                17
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "link__Import": {},
        "link__Purpose": {},
        "LoginUserInput": {
            "email": [
                5
            ],
            "password": [
                5
            ],
            "__typename": [
                5
            ]
        },
        "Mutation": {
            "createUser": [
                51,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                48,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                51,
                {
                    "input": [
                        22,
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
                        5,
                        "String!"
                    ]
                }
            ],
            "createPost": [
                29,
                {
                    "input": [
                        4,
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
            "follow": [
                49,
                {
                    "input": [
                        14,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                49,
                {
                    "input": [
                        14,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                19,
                {
                    "input": [
                        18,
                        "LikeInput!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "input": [
                        18,
                        "LikeInput!"
                    ]
                }
            ],
            "triggerWeightDecay": [
                11,
                {
                    "dryRun": [
                        3
                    ]
                }
            ],
            "__typename": [
                5
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
                5
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
                5
            ]
        },
        "PostListOutputDto": {
            "data": [
                28
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "PostOutput": {
            "id": [
                6
            ],
            "title": [
                5
            ],
            "content": [
                5
            ],
            "image": [
                5
            ],
            "tags": [
                5
            ],
            "userId": [
                6
            ],
            "status": [
                35
            ],
            "createdAt": [
                8
            ],
            "updatedAt": [
                8
            ],
            "__typename": [
                5
            ]
        },
        "PostOutputData": {
            "items": [
                27
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "PostOutputDto": {
            "data": [
                27
            ],
            "code": [
                0
            ],
            "__typename": [
                5
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
                5
            ]
        },
        "PostRecommendationItemDto": {
            "postId": [
                6
            ],
            "score": [
                10
            ],
            "__typename": [
                5
            ]
        },
        "PostRecommendationItemDtoData": {
            "items": [
                31
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "PostRecommendationOutputDto": {
            "data": [
                32
            ],
            "code": [
                0
            ],
            "__typename": [
                5
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
                35
            ],
            "__typename": [
                5
            ]
        },
        "PostStatusEnum": {},
        "Query": {
            "findUserById": [
                51,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                48,
                {
                    "id": [
                        5,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                29,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                26,
                {
                    "input": [
                        34,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "searchPosts": [
                40,
                {
                    "input": [
                        37,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                46,
                {
                    "input": [
                        37,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                43,
                {
                    "input": [
                        37,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                49,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "postLikeCount": [
                24,
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
            "postRecommendation": [
                33,
                {
                    "input": [
                        30,
                        "PostRecommendationInput!"
                    ]
                }
            ],
            "userRecommendation": [
                55,
                {
                    "input": [
                        52,
                        "UserRecommendationInput!"
                    ]
                }
            ],
            "__typename": [
                5
            ]
        },
        "SearchInput": {
            "query": [
                5
            ],
            "page": [
                6
            ],
            "take": [
                6
            ],
            "__typename": [
                5
            ]
        },
        "SearchPostHitDto": {
            "id": [
                6
            ],
            "title": [
                5
            ],
            "content": [
                5
            ],
            "userId": [
                6
            ],
            "score": [
                10
            ],
            "tags": [
                5
            ],
            "__typename": [
                5
            ]
        },
        "SearchPostHitDtoData": {
            "items": [
                38
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "SearchPostOutputDto": {
            "data": [
                39
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagHitDto": {
            "id": [
                5
            ],
            "name": [
                5
            ],
            "score": [
                10
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagHitDtoData": {
            "items": [
                41
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagOutputDto": {
            "data": [
                42
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDto": {
            "id": [
                6
            ],
            "email": [
                5
            ],
            "name": [
                5
            ],
            "score": [
                10
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                44
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserOutputDto": {
            "data": [
                45
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "SessionOutput": {
            "id": [
                6
            ],
            "guid": [
                5
            ],
            "userId": [
                6
            ],
            "status": [
                1
            ],
            "createdAt": [
                8
            ],
            "updatedAt": [
                8
            ],
            "__typename": [
                5
            ]
        },
        "SessionOutputDto": {
            "data": [
                47
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "UserCountsDto": {
            "data": [
                12
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "UserOutput": {
            "id": [
                6
            ],
            "name": [
                5
            ],
            "email": [
                5
            ],
            "createdAt": [
                8
            ],
            "updatedAt": [
                8
            ],
            "__typename": [
                5
            ]
        },
        "UserOutputDto": {
            "data": [
                50
            ],
            "code": [
                0
            ],
            "__typename": [
                5
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
                5
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
                10
            ],
            "__typename": [
                5
            ]
        },
        "UserRecommendationItemDtoData": {
            "items": [
                53
            ],
            "meta": [
                25
            ],
            "__typename": [
                5
            ]
        },
        "UserRecommendationOutputDto": {
            "data": [
                54
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "WeightSnapshotDto": {
            "min": [
                10
            ],
            "max": [
                10
            ],
            "mean": [
                10
            ],
            "__typename": [
                5
            ]
        }
    }
}