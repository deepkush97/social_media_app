export default {
    "scalars": [
        0,
        1,
        3,
        5,
        6,
        8,
        10,
        12,
        13,
        17,
        18,
        29,
        33
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
                10
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
                14
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
                49,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                46,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                49,
                {
                    "input": [
                        19,
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
                26,
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
                47,
                {
                    "input": [
                        11,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                47,
                {
                    "input": [
                        11,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                16,
                {
                    "input": [
                        15,
                        "LikeInput!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "input": [
                        15,
                        "LikeInput!"
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
                25
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
                33
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
                24
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "PostOutputDto": {
            "data": [
                24
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
                29
            ],
            "__typename": [
                5
            ]
        },
        "Float": {},
        "PostRecommendationItemDtoData": {
            "items": [
                28
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "PostRecommendationOutputDto": {
            "data": [
                30
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
                33
            ],
            "__typename": [
                5
            ]
        },
        "PostStatusEnum": {},
        "Query": {
            "findUserById": [
                49,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                46,
                {
                    "id": [
                        5,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                26,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                23,
                {
                    "input": [
                        32,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "searchPosts": [
                38,
                {
                    "input": [
                        35,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                44,
                {
                    "input": [
                        35,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                41,
                {
                    "input": [
                        35,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                47,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "postLikeCount": [
                21,
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
                31,
                {
                    "input": [
                        27,
                        "PostRecommendationInput!"
                    ]
                }
            ],
            "userRecommendation": [
                53,
                {
                    "input": [
                        50,
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
                29
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
                36
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "SearchPostOutputDto": {
            "data": [
                37
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
                29
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagHitDtoData": {
            "items": [
                39
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagOutputDto": {
            "data": [
                40
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
                29
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                42
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserOutputDto": {
            "data": [
                43
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
                45
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
                9
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
                48
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
                29
            ],
            "__typename": [
                5
            ]
        },
        "UserRecommendationItemDtoData": {
            "items": [
                51
            ],
            "meta": [
                22
            ],
            "__typename": [
                5
            ]
        },
        "UserRecommendationOutputDto": {
            "data": [
                52
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        }
    }
}