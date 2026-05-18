export const getPagination = (page: number, limit: number) => {
    const skip = limit * (page - 1)
    const take = limit
    return { skip, take }
}
