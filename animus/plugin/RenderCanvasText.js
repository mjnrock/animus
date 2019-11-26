import Sequencer from "../Sequence";

export default class RenderCanvasText extends Sequencer {
    constructor(htmlCanvas, nodes = [], fps = 5) {
        super(nodes);

        this.Canvas = htmlCanvas;
        this.Loop = null;

        this.prop("fps", fps);
        this.listen("next", this.drawListener.bind(this));
    }

    Start(fps = 5) {
        this.prop("index", 0);
        this.prop("fps", fps);
        this.Loop = setInterval(() => {
            this.trigger("next");
        }, 1000 / fps);

        return this;
    }
    Stop() {
        clearInterval(this.Loop);

        return this;
    }

    drawListener(target, result) {
        if(result === true) {
            this.Draw(target);
        }
    }
    Draw(target) {
        if(this.Canvas) {
            let ctx = this.Canvas.getContext("2d");
            ctx.font = "64pt Arial";

            ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
            ctx.fillText(
                target.GetActiveNode().prop("data"),
                Math.random() * 500,
                Math.random() * 500
            );
        }
    }
};