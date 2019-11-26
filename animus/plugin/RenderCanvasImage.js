import Sequencer from "../Sequence";
import ImageNode from "./ImageNode";

export default class RenderCanvasImage extends Sequencer {
    constructor(htmlCanvas, nodes = [], fps = 5) {
        super(nodes);

        this.Canvas = htmlCanvas;
        this.Loop = null;

        this.prop("fps", fps);
        this.listen("next", this.drawListener.bind(this));
    }

    setNodes(nodes = []) {
        this.Nodes = [];

        for(let i in nodes) {
            let node = nodes[ i ];

            if(/[/.](gif|jpg|jpeg|tiff|png)$/i.test(node)) {
                this.Nodes.push(new ImageNode(node, () => true));
            } else if(node instanceof ImageNode) {
                this.Nodes.push(node);
            } else if(Array.isArray(node)) {
                let [ uri, next, state ] = node;

                this.Nodes.push(new ImageNode(uri, next, state));
            }
        }

        return this;
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

            ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
            ctx.drawImage(
                target.GetActiveNode().getDatum("image"),
                0,
                0
            );
        }
    }
};