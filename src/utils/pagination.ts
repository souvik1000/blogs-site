export const getPagination = (page: number, limit: number) => {
    let pageVal = page || 1
    let limitVal = limit || 5

    const skip = limitVal * (pageVal - 1)
    const take = limitVal
    return { pageVal, limitVal, skip, take }
}
