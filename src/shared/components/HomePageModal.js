import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePageModal() {

    const [open, setOpen] = useState(true);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
    };

    return <div>
        <Dialog 
            onClose={() => setOpen(false)} 
            aria-labelledby="simple-dialog-title" 
            open={open}
        >
            <Slider {...settings} style={{ margin: 28}}>
                <div>
                    <img src="./images/logged_out/certificate.jpeg" alt='slider1' style={{width: "100%", height: "100%"}} />
                </div>
                <div>
                    <img src="./images/logged_out/slider1.jpeg" alt='slider2' style={{width:"100%", height:"100%"}}/>
                </div>
            </Slider>
        </Dialog>
    </div>
}