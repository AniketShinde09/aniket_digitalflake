import { ADD_STATE_DATA, CREATE_USER, LOGOUT, REQUEST, REQUEST_FAIL, REQUEST_SUCCESS, STORE_STATE_DATA, TOGGLE_FORM, UPDATE_STATE_DATA } from "./actionType";
import axios from 'axios'


export const toggleForm = () => {
    return { type: TOGGLE_FORM };
};

export const createUser = () => {
    return { type: CREATE_USER }
}

export const loginUser = (vals) => async (dispatch) => {
    dispatch({ type: REQUEST });
    try {
        const response = await axios.post("https://digitalflake-backend.onrender.com/user/login", vals);
        dispatch({ type: REQUEST_SUCCESS, payload: response.data });
        return response; // Make sure to return the full response object
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error; // Ensure the error is thrown to be caught by the .catch block
    }
};


export const signupUser = (data) => async (dispatch) => {
    dispatch({ type: REQUEST });
    try {
        const response = await axios.post("https://digitalflake-backend.onrender.com/user/signup", data);
        dispatch({ type: REQUEST_SUCCESS });
        return response; // Make sure to return the response
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error; // Rethrow error to be caught in handleSignup
    }
};

export const addState=(data)=> async (dispatch)=>{
    dispatch({ type: REQUEST });
    try {
        const response = await axios.post("https://digitalflake-backend.onrender.com/state/addState", data);
        dispatch({ type: REQUEST_SUCCESS });
        if (response.status === 201) {
            const newState = {
                id: response.data.data._id,
                name: response.data.data.name,
                code: response.data.data.code,
                status: response.data.data.status
            };
            dispatch({ type: ADD_STATE_DATA, payload: newState });         
        }
        console.log(response);        
        return response
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error; // Rethrow error to be caught in handleSignup
    }
}

export const editState = (updatedData) => async (dispatch, getState) => {
    dispatch({ type: REQUEST });
    try {
        const response = await axios.put(`https://digitalflake-backend.onrender.com/state/updateState/${updatedData.id}`, updatedData);
        dispatch({ type: REQUEST_SUCCESS });
        if (response.status === 200) {
            const currentStateData = getState().stateData;  // Get current state data from Redux
            const updatedStateData = currentStateData.map((state) =>
                state.id === updatedData.id ? updatedData : state
            );
            dispatch({ type: UPDATE_STATE_DATA, payload: updatedStateData }); // Update state data
        }
        return response;
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error;
    }
};

export const deleteState = (id) => async (dispatch, getState) => {
    dispatch({ type: REQUEST });
    try {
        const response = await axios.delete(`https://digitalflake-backend.onrender.com/state/deleteState/${id}`);
        dispatch({ type: REQUEST_SUCCESS });
        if (response.status === 200) {
            const currentStateData = getState().stateData;  // Get current state data from Redux
            const updatedStateData = currentStateData.filter((state) => state.id !== id); // Remove the deleted state
            dispatch({ type: STORE_STATE_DATA, payload: updatedStateData });  // Update state data
        }
        return response;
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error;
    }
};


export const storeStateData = (data) => {
    return { type: STORE_STATE_DATA, payload: data }; // Action to store state data
};

export const addStateData = (data) => {
    return { type: ADD_STATE_DATA, payload: data }; // Action to store state data
};

export const logoutUser = () => async (dispatch) => {
    dispatch({ type: REQUEST });
    try {
        const response = await axios.post("https://digitalflake-backend.onrender.com/user/logout");
        dispatch({ type: LOGOUT });
        return response;
    } catch (error) {
        dispatch({ type: REQUEST_FAIL });
        throw error;
    }
};
