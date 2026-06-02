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
        28,
        32
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
                45,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                42,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                45,
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
                43,
                {
                    "input": [
                        11,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                43,
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
                28
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
                28
            ],
            "__typename": [
                5
            ]
        },
        "PostStatusEnum": {},
        "Query": {
            "findUserById": [
                45,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                42,
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
                        27,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "searchPosts": [
                34,
                {
                    "input": [
                        30,
                        "SearchInput!"
                    ]
                }
            ],
            "searchUsers": [
                40,
                {
                    "input": [
                        30,
                        "SearchInput!"
                    ]
                }
            ],
            "searchTags": [
                37,
                {
                    "input": [
                        30,
                        "SearchInput!"
                    ]
                }
            ],
            "userCounts": [
                43,
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
                32
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
                31
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
                33
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
                32
            ],
            "__typename": [
                5
            ]
        },
        "SearchTagHitDtoData": {
            "items": [
                35
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
                36
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
                32
            ],
            "__typename": [
                5
            ]
        },
        "SearchUserHitDtoData": {
            "items": [
                38
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
                39
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
                41
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
                44
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