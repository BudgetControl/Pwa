interface Attribute {
    Name: string;
    Value: string;
}

interface User {
    Username: string;
    Attributes: Attribute[];
    UserCreateDate: string;
    UserLastModifiedDate: string;
    Enabled: boolean;
    UserStatus: string;
}

interface Metadata {
    statusCode: number;
    effectiveUri: string;
    headers: {
        date: string;
        'content-type': string;
        'content-length': string;
        connection: string;
        'x-amzn-requestid': string;
    };
    transferStats: {
        http: Array<any>[];
    };
}

interface SignUpResponse {
    success: string;
    details: {
        User: User;
        '@metadata': Metadata;
    };
}

export type { SignUpResponse, User, Attribute, Metadata };