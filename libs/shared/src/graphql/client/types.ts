export default {
    "scalars": [
        0,
        1,
        3,
        5,
        6,
        7,
        8,
        9,
        10,
        13
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
        "String": {},
        "DateTime": {},
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
                18,
                {
                    "input": [
                        4,
                        "CreateUserInput!"
                    ]
                }
            ],
            "createSession": [
                16,
                {
                    "id": [
                        13,
                        "Int!"
                    ]
                }
            ],
            "loginUser": [
                18,
                {
                    "input": [
                        11,
                        "LoginUserInput!"
                    ]
                }
            ],
            "closeAllOpenSessionByUserId": [
                2,
                {
                    "id": [
                        13,
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
            "__typename": [
                5
            ]
        },
        "Int": {},
        "Query": {
            "findUserById": [
                18,
                {
                    "id": [
                        13,
                        "Int!"
                    ]
                }
            ],
            "findOpenSessionByGuid": [
                16,
                {
                    "id": [
                        5,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                5
            ]
        },
        "SessionOutput": {
            "id": [
                13
            ],
            "guid": [
                5
            ],
            "userId": [
                13
            ],
            "status": [
                1
            ],
            "createdAt": [
                6
            ],
            "updatedAt": [
                6
            ],
            "__typename": [
                5
            ]
        },
        "SessionOutputDto": {
            "data": [
                15
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
                13
            ],
            "name": [
                5
            ],
            "email": [
                5
            ],
            "createdAt": [
                6
            ],
            "updatedAt": [
                6
            ],
            "__typename": [
                5
            ]
        },
        "UserOutputDto": {
            "data": [
                17
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