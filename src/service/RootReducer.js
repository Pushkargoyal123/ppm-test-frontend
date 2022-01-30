var initialState={
    user:{}
}

export default function RootReducer(state=initialState, action){
    switch(action.type){
        case "ADD_USER":
            state.user[action.payload[0]]= action.payload[1];
            return {user:state.user};
        case "DEL_USER":
            delete state.user[action.payload[0]]
            return {user:state.user};
        default:
            return state;
    }
}