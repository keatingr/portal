import React from 'react';
import Raphael from 'raphael';

class DrawPort extends React.Component {
    constructor() {
        super();
        this.state = {
            dispimage: {}
        };
    }
    drawBox(gender, fb, age, gaze) {
        let DrawPort = this;
        gender === "male" ? this.stereotype = "#1c5de1" : this.stereotype = "#ff64c2";
        let box = DrawPort.R.rect(fb.x, fb.y, fb.width, fb.height);
        box.attr({
            fill: this.stereotype,
            stroke: this.stereotype,
            opacity: 0.3,
            cursor: 'pointer',
            // title: "age: " + age + "\nlooking at camera: " + gaze + "\nx, y, width, height: " + fb.x + ", " + fb.y + ", " + fb.width + ", " + fb.height
            title: "x, y, width, height: " + fb.x + ", " + fb.y + ", " + fb.width + ", " + fb.height
        });
        box.glow({color: this.stereotype, width: 10});
        return {box}
    };
    componentDidMount() {
        this.R = Raphael("canvas", 800, 500);
    };
    componentDidUpdate() {
        let BASE_TEN = 10;
        if (this.props.boxes && this.props.boxes.length > 0) {
            this.props.boxes.forEach((box) => {
                this.drawBox(box.gender, {
                    x: parseInt(box.x, BASE_TEN),
                    y: parseInt(box.y, BASE_TEN),
                    width: parseInt(box.width, BASE_TEN),
                    height: parseInt(box.height, BASE_TEN)
                }, box.age, box.gaze)
            });
        }
        else {
            this.R.clear()
        }
    };
    render() {
        // TODO: add width and height for firefox support
        return(
            <div>
                <div id="title">Title</div>
                <div id="canvas" >&nbsp;</div>
                <svg width="800px" height="500px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <image id="dispimage" xlinkHref={this.props.dispimage} />
                </svg>
            </div>
        )
    }
}

export default DrawPort;
