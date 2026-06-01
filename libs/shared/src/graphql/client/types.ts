export default {
    "scalars": [
        0,
        1,
        3,
        5,
        6,
        8,
        11,
        12,
        16,
        17,
        27,
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
                13
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
                44,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                41,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                44,
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
                42,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                42,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "likePost": [
                15,
                {
                    "input": [
                        14,
                        "LikeInput!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "input": [
                        14,
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
                44,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                41,
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
                33,
                {
                    "input": [
                        29,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                39,
                {
                    "input": [
                        29,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                36,
                {
                    "input": [
                        29,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                42,
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
                31
            ],
            "tags": [
                5
            ],
            "__typename": [
                5
            ]
        },
        "Float": {},
        "SearchPostHitDtoData": {
            "items": [
                30
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
                32
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
                31
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagHitDtoData": {
            "items": [
                34
            ],
            "meta": [
                21
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagOutputDto": {
            "data": [
                35
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
                31
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                37
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
                38
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
                40
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
                43
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