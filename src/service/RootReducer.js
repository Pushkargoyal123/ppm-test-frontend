var initialState = {
    user: {},
    group: {},
    userGroup: {}
}

export default function RootReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_USER":
            state.user[action.payload[0]] = action.payload[1];
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        case "SET_GROUP":
            state.group[action.payload[0]] = action.payload[1];
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        case "SET_USER_GROUP":
            state.userGroup[action.payload[0]] = action.payload[1];
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        case "DEL_USER":
            delete state.user[action.payload[0]]
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        case "DEL_GROUP":
            delete state.group[action.payload[0]]
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        case "DEL_USER_GROUP":
            delete state.userGroup[action.payload[0]]
            return { user: state.user, group: state.group, userGroup: state.userGroup };
        default:
            return state;
    }
}