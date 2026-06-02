export const mockQueryBuilder = {
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
    execute: jest.fn(),
}

export const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    create: jest.fn((data) => ({ id: 1, ...data })),
    merge: jest.fn((target, source) => Object.assign(target, source)),
    save: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
}

export const mockEntityManager = {
    findOne: jest.fn(),
    create: jest.fn((entity, data) => ({ id: 1, ...data })),
    save: jest.fn((entityOrData, data) => {
        const item = data || entityOrData
        return Promise.resolve({ id: 1, ...item })
    }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
}

// Set up the default Jest mock for the data source returning the single mockRepository
jest.mock("../config/data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn().mockReturnValue(mockRepository),
        transaction: jest
            .fn()
            .mockImplementation((cb) => cb(mockEntityManager)),
    },
}))
