import * as themeActionType from './themeActions';
import { selectedTheme } from '../constants';

const initialState={
    appTheme: selectedTheme,
    error: null
}

const themeReducer = (state = initialState, action) => {
    switch(action.type) {
        case themeActionType.TOGGLE_THEME_BEGIN:
            return {
                ...state,
                error: null
            }
        case themeActionType.TOGGLE_THEME_SUCCESS:
        return {
            ...state,
            appTheme: action.payload.selectedTheme
        }
        case themeActionType.TOGGLE_THEME_FAILURE:
            return {
                ...state,
                error: action.payload.error
            }
            default: 
            return state
    }
}

export default themeReducer;