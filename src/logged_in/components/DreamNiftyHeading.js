
const style = {
    height:"100%",
    color: "white",
    backgroundColor:"green",
    fontWeight: 600,
    fontSize: 30,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
}

export default function DreamNiftyHeading() {

    const eventInfo = JSON.parse(sessionStorage.getItem('clickedEvent'));

    return <div style={{width:"100%", height:80}}>
        {
            eventInfo ?
                <div style={style}>
                    <div>
                        {eventInfo.title}
                    </div>
                </div> :
                <div></div>
        }
    </div>
}