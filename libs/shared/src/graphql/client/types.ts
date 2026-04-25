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
        13,
        14,
        23
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
                29,
                {
                    "input": [
                        7,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                26,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                29,
                {
                    "input": [
                        15,
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
                21,
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
                2,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
            ],
            "unfollow": [
                2,
                {
                    "input": [
                        10,
                        "FollowUnfollowInput!"
                    ]
                }
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
                20
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
                23
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
                19
            ],
            "meta": [
                17
            ],
            "__typename": [
                5
            ]
        },
        "PostOutputDto": {
            "data": [
                19
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
                23
            ],
            "__typename": [
                5
            ]
        },
        "PostStatusEnum": {},
        "Query": {
            "findUserById": [
                29,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                26,
                {
                    "id": [
                        5,
                        "String!"
                    ]
                }
            ],
            "findPostById": [
                21,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
            ],
            "findPostsByUserId": [
                18,
                {
                    "input": [
                        22,
                        "PostsPaginationInput!"
                    ]
                }
            ],
            "userCounts": [
                27,
                {
                    "id": [
                        6,
                        "Int!"
                    ]
                }
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
                25
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
                28
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