export interface User {
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    status: number,
    gender: string,
    birthday: {
        day: string,
        month: string,
        year: string
    }
    photoURL: string,
}