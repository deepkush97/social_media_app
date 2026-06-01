export default {
    "scalars": [
        0,
        1,
        3,
        5,
        6,
        8,
        13,
        14,
        16,
        17,
        27,
        30
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
        "FollowUnfollowInput": {
            "followerId": [
                6
            ],
            "followingId": [
                6
            ],
            "__typename": [
                5
            ]
        },
        "InteractionDto": {
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
            "__typename": [
                5
            ]
        },
        "InteractionOutputDto": {
            "data": [
                11
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "join__FieldSet": {},
        "join__Graph": {},
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
                40,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                37,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                40,
                {
                    "input": [
                        18,
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
                25,
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
                38,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                38,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                12,
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
                24
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
            "userId": [
                6
            ],
            "status": [
                27
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
                23
            ],
            "meta": [
                21
            ],
            "__typename": [
                5
            ]
        },
        "PostOutputDto": {
            "data": [
                23
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "PostsPaginationInput": {
            "userId": [
                6
            ],
            "take": [
                6
            ],
            "page": [
                6
            ],
            "status": [
                27
            ],
            "__typename": [
                5
            ]
        },
        "PostStatusEnum": {},
        "Query": {
            "findUserById": [
                40,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                37,
                {
                    "id": [
                        5,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                25,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                22,
                {
                    "input": [
                        26,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "searchPosts": [
                32,
                {
                    "query": [
                        5,
                        "String!"
                    ],
                    "page": [
                        6
                    ],
                    "take": [
                        6
                    ]
                }
            ],
            "searchUsers": [
                35,
                {
                    "query": [
                        5,
                        "String!"
                    ],
                    "page": [
                        6
                    ],
                    "take": [
                        6
                    ]
                }
            ],
            "searchTags": [
                35,
                {
                    "query": [
                        5,
                        "String!"
                    ],
                    "page": [
                        6
                    ],
                    "take": [
                        6
                    ]
                }
            ],
            "userCounts": [
                38,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "postLikeCount": [
                20,
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
            "__typename": [
                5
            ]
        },
        "SearchPostHitDto": {
            "postId": [
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
                30
            ],
            "__typename": [
                5
            ]
        },
        "Float": {},
        "SearchPostHitDtoData": {
            "items": [
                29
            ],
            "meta": [
                21
            ],
            "__typename": [
                5
            ]
        },
        "SearchPostOutputDto": {
            "data": [
                31
            ],
            "code": [
                0
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDto": {
            "userId": [
                6
            ],
            "username": [
                5
            ],
            "displayName": [
                5
            ],
            "score": [
                30
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                33
            ],
            "meta": [
                21
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserOutputDto": {
            "data": [
                34
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
                36
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
                39
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