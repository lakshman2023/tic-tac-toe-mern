const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'SET_MATCH':
            return {
                ...state,
                match: action.payload
            };
        case 'SET_USER_SYMBOL':
            return {
                ...state,
                userSymbol: action.payload
            };
        default:
            return state;
    }
};

export default reducer;

