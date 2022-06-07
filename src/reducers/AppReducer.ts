
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null
}
type InitialStateType = typeof initialState
export const AppReducer = (state: InitialStateType = initialState, action:
    AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP-SET-STATUS':
            return {...state, status: action.status}
        case 'APP-SET-ERROR':
            return {...state, error: action.error}

        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP-SET-STATUS',
        status
    } as const
}

export const setAppErrorAC = (error: string | null) => {
    return {
        type: 'APP-SET-ERROR',
        error
    } as const
}

type SetAppActionType = ReturnType<typeof setAppStatusAC>
type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>


export type AppActionsType = SetAppActionType | SetAppErrorActionType