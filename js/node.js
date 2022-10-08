class nodeElement {
    constructor(id){
        this.data = data[id]
        this.id = id
        this.dom = this.createNode(id)
        return this.dom
    }
    createNode(id){
        let node = $(`
        <div id="node-${id}" class="node" style="left: ${this.data.x - r}px;top: ${this.data.y - r}px">
                    <div class="sector hide top dir-1" dir="1">
                        <div class="seat_number">1</div>
                    </div>
                    <div class="sector hide right dir-2" dir="2">
                        <div class="seat_number">2</div>
                    </div>
                    <div class="sector hide left dir-4" dir="4">
                        <div class="seat_number">4</div>
                    </div>
                    <div class="sector hide bottom dir-3" dir="3">
                        <div class="seat_number">3</div>
                    </div>
                    <div class="button-group hide">
                        <button class="btn l node-delete">X</button>
                        <button class="btn r node-edit">E</button>
                    </div>
                </div>
`)
        $('.node-container').append(node)
        node[0].obj = this
        return node
    }
    updatePos(x,y){
        this.data.x = x
        this.data.y = y
        this.dom.css({
            "left" : x - r + 'px',
            "top" : y - r + 'px',
        })
        this.updateLinks()
    }
    updateLinks(){
        linkEach(this.id,(pos,val)=>{
            let [x1,y1] = getLinkPointP(this.id,pos)
            let {id2,pos2} = val
            let [x2,y2] = getLinkPointP(id2,pos2)
            let line = getLine(this.id,pos)
            line.attr({
                'x1':x1,
                'y1':y1,
                'x2':x2,
                'y2':y2
            })
        })
    }
}


































