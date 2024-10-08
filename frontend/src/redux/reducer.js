import { REQUEST, REQUEST_FAIL, REQUEST_SUCCESS, TOGGLE_FORM, STORE_STATE_DATA, UPDATE_STATE_DATA, ADD_STATE_DATA, LOGOUT, TOGGLE_PAGE } from "./actionType";

const initialState = {
    showLogin: true,
    token: null,
    userId: null,
    isLoading: false,
    isError: false,
    stateData: [],
    activePage:"Home"
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_FORM:
            return {
                ...state,
                showLogin: !state.showLogin,
            };
        case TOGGLE_PAGE:
            return {
                ...state,
                activePage: action.payload
            };
        case REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                token: action.payload
            }
        case REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        case STORE_STATE_DATA:
            return {
                ...state,
                stateData: action.payload
            }
        case UPDATE_STATE_DATA:
            return {
                ...state,
                stateData: action.payload
            }
        case ADD_STATE_DATA:
            return {
                ...state,
                stateData: [...state.stateData, action.payload]
            }
        case LOGOUT:
            return {
                ...state,
                token: null,  // Clear token on logout
                userId: null, // Clear userId if needed
            };
        default:
            return state;
    }
};
