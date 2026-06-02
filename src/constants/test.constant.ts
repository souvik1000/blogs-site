export const mockOrder = {
    id: 1,
    userId: 1,
    productId: 2,
    status: "pending",
    amount: 99.99,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockOrderInput = {
    userId: 1,
    status: "pending",
    amount: 50.0,
}

export const mockOrderInputNonExistentUser = {
    userId: 999,
    status: "pending",
    amount: 50.0,
}

export const mockInvalidOrderInput = {
    amount: -10,
}

export const mockOrderUpdateInput = {
    userId: 1,
    status: "completed",
    amount: 99.99,
}

export const mockUpdatedOrderResponse = {
    ...mockOrder,
    status: "completed",
}

export const mockGuestOrderInput = {
    firstName: "Guest",
    lastName: "User",
    email: "guest@example.com",
    status: "pending",
    amount: 120.0,
}

export const mockUserResponse = { id: 1 }

export const mockGuestUserResponse = {
    id: 5,
    email: "guest@example.com",
}

export const mockOrderExecuteResult = {
    raw: [],
    affected: 1,
}

export const mockUser = {
    id: 1,
    name: "Test User",
    email: "testuser@example.com",
    bio: "Hello World",
    profilePic: "pic.jpg",
    isGuest: false,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockInvalidUserCreateInput = { name: "Ab" }

export const mockUserCreateInput = {
    name: "Jane Doe",
    email: "janedoe@example.com",
    password: "Password123!",
    bio: "Artist",
}

export const mockInvalidUserUpdateInput = { email: "invalid-email" }

export const mockUserUpdateNameInput = { name: "New Name" }

export const mockUserUpdateSuccessInput = { name: "Updated User Name" }

export const mockUserExecuteResult = { raw: [], affected: 1 }

export const mockBlog = {
    id: 1,
    title: "Test Blog Title",
    subtitle: "Test Subtitle",
    content: "Test Content",
    author: "Test Author",
}

export const mockBlogInputMissingFields = { subtitle: "Only subtitle" }

export const mockBlogInputDuplicate = {
    title: "Test Blog Title",
    content: "Some new content",
    author: "Some Author",
}

export const mockBlogInputCreate = {
    title: "Brand New Blog",
    content: "Very interesting content",
    author: "Creative Writer",
    subtitle: "Subby",
}

export const mockBlogInputUpdateNotFound = { title: "Updated Title" }

export const mockBlogInputUpdate = {
    title: "Totally New Title",
    content: "Updated Content",
}

export const mockBlogExecuteResult = {
    identifiers: [{ id: 2 }],
    generatedMaps: [],
    raw: [],
}

export const mockBlogExecuteUpdateResult = { affected: 1 }

export const mockBlogExecuteDeleteNotFound = { affected: 0 }

export const mockStudentInputMissingFields = { name: "John Doe" }

export const mockStudentCreateInput = {
    name: "John Doe",
    age: 20,
    cgpa: 8.5,
    isPlaced: false
}

export const mockStudentCreateResponse = {
    id: 1,
    name: "John Doe",
    age: 20,
    cgpa: 8.5,
    isPlaced: false
}

export const mockStudentDuplicateInput = {
    name: "John Doe",
    age: 21,
    cgpa: 9.0,
    isPlaced: true
}

export const mockStudentUpdateInput = {
    name: "John Doe Updated",
    isPlaced: true
}

export const mockStudentUpdateNotFoundInput = { name: "Ghost" }

export const mockJaneStudentInput = {
    name: "Jane Smith",
    age: 22,
    cgpa: 9.2,
    isPlaced: true
}
