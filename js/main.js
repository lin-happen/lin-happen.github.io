let data = {}
let nodeId = 1
const distance = 250
const r = 50
let mouseClientX = 0
let mouseClientY = 0
let faker = null
let dline = null
let shiftDown = false

$(()=>{
    if (localStorage.lj){
        createFromStorage()
    }else{
        createFirstNode()
    }
    bindEvent()
    saveStorage()
})
function createFirstNode() {
    let newId = createId()
    saveData(newId,window.innerWidth /2 ,window.innerHeight /2)
    new nodeElement(newId)
}
function createId() {
    return nodeId++
}
function getDom(id) {
    return $('#node-' + id)
}
function getId(dom) {
    return parseInt(dom[0].id.split('-')[1])
}
function getLine(id,pos) {
    return $(`.line-${id}-${pos}`)
}
function getDir(sector) {
    return parseInt(sector.attr('dir'))
}
function saveData(id,x,y,links = [undefined,null,null,null,null],content="") {
    data[id] = {
        x:x,y:y,links:links,content:content
    }
    return data[id]
}
function saveLinks(id1,pos1,id2,pos2,inputName="") {
    data[id1].links[pos1] = {id2,pos2,inputName}
}
function bindEvent() {
    clickNode()
    clickX()
    clickE()
    drag()
    keydownShift()
    changeMode()
    presentation()
    keydown1234()
    saveImg()
}

function clickNode() {
    $(document).on("click",event=>{
        let target = $(event.target)
        if (target.hasClass('content') || target.hasClass('node')){
            $('.node').children().addClass('hide')
            $('.node').removeClass('nodeClick')
            if (dline){
                dline.css({
                    "stroke" : "pink"
                })
                dline = null
            }
        }
        if (target.hasClass('node')){
            target.children().removeClass('hide')
            target.addClass('nodeClick')
        }
        if (target.hasClass('sector') && !shiftDown){
            let pos1 = parseInt(target.attr("dir"))
            let node1 = target.parent()
            let id1 = getId(node1)
            if (data[id1].links[pos1] === null){
                let id2 = createId()
                let [x2,y2,pos2] = getNextNode(id1,pos1)
                saveData(id2,x2,y2)
                let node2 = new nodeElement(id2)
                let sector2 = node2.children('.dir-' + pos2)
                linkSector(target,sector2)
            }
        }
        if (target.hasClass('line')){
            $(".line").css({"stroke" : "pink"})
            target.css({"stroke" : "red"})
            dline = target
        }
        if (target.hasClass("fullscreen")){
            document.documentElement.requestFullscreen()
        }
        if (target.hasClass("exit") && document.fullscreenElement !== null){
            document.exitFullscreen()
        }
    })
}
function getNextNode(id,pos) {
    let {x,y} = data[id]
    switch (pos) {
        case 1: return [x,y - distance,3]
        case 2: return [x + distance,y,4]
        case 3: return [x,y + distance,1]
        case 4: return [x - distance,y,2]
    }
}
function getLinkPointP(id,section) {
    let {x,y} = data[id]
    switch (section) {
        case 1: return [x,y - r]
        case 2: return [x + r,y]
        case 3: return [x,y + r]
        case 4: return [x - r,y]
    }
}
function createLine(id1,pos1,id2,pos2) {
    let [x1,y1] = getLinkPointP(id1,pos1)
    let [x2,y2] = getLinkPointP(id2,pos2)
    let line = `<line class="line line-${id1}-${pos1} line-${id2}-${pos2}" stroke-width="4" stroke="pink" x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" id1="${id1}" pos1="${pos1}"></line>`
    $('.line-container')[0].insertAdjacentHTML("beforeend",line)

}
function linkSector(sector1,sector2) {
    let node1 = sector1.parent()
    let node2 = sector2.parent()
    let id1 = getId(node1)
    let id2 = getId(node2)
    let pos1 = getDir(sector1)
    let pos2 = getDir(sector2)
    sector1.addClass('active')
    sector2.addClass('active')
    createLine(id1,pos1,id2,pos2)
    saveLinks(id1,pos1,id2,pos2)
    saveLinks(id2,pos2,id1,pos1)
}
function drag() {
    let mousedown = false
    let mouseDownX = 0
    let mouseDownY = 0
    let nodeDownX = 0
    let nodeDownY = 0
    let node = null
    $(document).on('mousedown',event=>{
        node = event.target
        if ($(node).hasClass("node")){
            mousedown = true
            mouseDownX = event.pageX
            mouseDownY = event.pageY
            nodeDownX = node.obj.data.x
            nodeDownY = node.obj.data.y
            console.log(node)
        }
    })
    $(document).on('mousemove',event=>{
        mouseClientX = event.pageX
        mouseClientY = event.pageY
        if (mousedown){
            let x = nodeDownX + mouseClientX - mouseDownX
            let y = nodeDownY + mouseClientY - mouseDownY
            node.obj.updatePos(x,y)
        }
        if (faker){
            faker.css({left: mouseClientX - 24 + 'px',top: mouseClientY - 24 + 'px'})
        }
    })
    $(document).on('mouseup touchend',event=>{
        node = null
        mousedown = false
    })
    $(document).on('touchstart',event=>{
        node = event.target
        if ($(node).hasClass("node")){
            mousedown = true
            mouseDownX = event.targetTouches[0].pageX
            mouseDownY = event.targetTouches[0].pageY
            nodeDownX = node.obj.data.x
            nodeDownY = node.obj.data.y
        }
    })
    $(document).on('touchmove',event=>{
        mouseClientX = event.targetTouches[0].pageX
        mouseClientY = event.targetTouches[0].pageY
        if (mousedown){
            let x = nodeDownX + mouseClientX - mouseDownX
            let y = nodeDownY + mouseClientY - mouseDownY
            node.obj.updatePos(x,y)
        }
        if (faker){
            faker.css({left: mouseClientX - 24 + 'px',top: mouseClientY - 24 + 'px'})
        }
    })
}


function keydownShift() {
    let sector1 = null
    let sector2 = null
    $(document).on("keydown",event=>{
        if (event.key === "Shift"){
            shiftDown = true
            $('.sector').removeClass('hide')
        }
        if (event.key === "Backspace" || event.key === "Delete"){
            if (dline){
                dline.remove()
                let id1 = parseInt(dline.attr("id1"))
                let pos1 = parseInt(dline.attr("pos1"))
                splitLinks(id1,pos1)
            }
        }
    })
    $(document).on("keyup",event=>{
        if (event.key === "Shift"){
            shiftDown = false
            $('.sector').addClass('hide')
            $(".button-group").addClass("hide")
        }
    })
    $(document).on('mousedown',event=>{
        let target = $(event.target)
        if (shiftDown && target.hasClass('sector') && !target.hasClass('active')){
            sector1 = target
            faker = $(sector1[0].outerHTML)
            $('.node-container').append(faker)
            faker.addClass('faker')
            faker.css({left : mouseClientX - 24 + 'px',top: mouseClientY - 24 + 'px'})
        }
    })
    $(document).on('mouseup',event=>{
        let target = $(event.target)
        if (shiftDown && target.hasClass('sector') && !target.hasClass("active") && sector1){
            sector2 = target
            let node1 = sector1.parent()
            let node2 = sector2.parent()
            if (node1[0] !== node2[0]){
                linkSector(sector1,sector2)
            }
        }
        sector1 = null
        sector2 = null
        if (faker){
            faker.remove()
        }
        faker = null
    })
}
function linkEach(id,callback) {
    for (let pos = 1;pos<data[id].links.length;pos++){
        if (data[id].links[pos]){
            callback(pos,data[id].links[pos])
        }
    }
}
function splitLinks(id,pos) {
    let links = data[id].links
    let {id2,pos2} = links[pos]
    let sector1 = getDom(id).children('.dir-' + pos)
    let sector2 = getDom(id2).children('.dir-' + pos2)
    sector1.removeClass('active')
    sector2.removeClass('active')
    data[id].links[pos] = null
    data[id2].links[pos2] = null
    let line = getLine(id,pos)
    line.remove()
}
function clickX() {
    $(document).on('click','.node-delete',event=>{
        let node1 = $(event.target).parents('.node')
        let id = getId(node1)
        linkEach(id,pos=>splitLinks(id,pos))
        node1.remove()
        delete data[id]
        if (Object.keys(data).length === 0){
            createFirstNode()
        }
    })
}
function saveStorage() {
    $(document).on('click mouseover mouseout mousedown mousemove mouseup keydown keyup',event=>{
        localStorage.lj = JSON.stringify(data)
    })
}
function createFromStorage() {
    data = JSON.parse(localStorage.lj)
    Object.keys(data).forEach(id=>{
        new nodeElement(id)
    })
    Object.keys(data).forEach(id=>{
        linkEach(id,(pos,val)=>{
            let id2 = val.id2
            let pos2 = val.pos2
            let sector1 = getDom(id).children('.dir-' + pos)
            let sector2 = getDom(id2).children('.dir-' + pos2)
            linkSector(sector1,sector2)
        })
        nodeId = parseInt(id) + 1
    })
}
function clickE() {
    let id = 0
    $(document).on('click','.node-edit',event=>{
        $('.edit').fadeIn()
        let node = $(event.target).parents('.node')
        id = getId(node)
        $('trix-editor').val(data[id].content)
        $(".ipt").attr("disabled","1")
        linkEach(id,(pos,val)=>{
            let ipt = $('.ipt-' + pos)
            ipt.removeAttr("disabled")
            ipt.val(val.inputName)
        })
    })
    $(document).on('click','.done',event=>{
        $('.edit').fadeOut(function () {
            let trix = $('trix-editor')
            data[id].content = trix.val()
            trix.val("")
            linkEach(id,(pos,val)=>{
                let ipt = $('.ipt-' + pos)
                val.inputName = ipt.val()
                ipt.val("")
            })
        })
    })
}
function changeMode() {
    $(document).on('click','.presentation',event=>{
        new preContainer(Object.keys(data)[0])
        $('.wrap').addClass('to-pre')

        $(".line-container").addClass("map")
        $('.node-container').addClass("map")
        $(".sector").addClass("hide")
        $(".button-group").addClass("hide")
        let node = getDom(Object.keys(data)[0]);
        node.addClass("red")
    })
    $(document).on('click','.design',event=>{
        $('.wrap').removeClass('to-pre')

        $('.line-container').removeClass("map")
        $('.node-container').removeClass("map")
        $('.node').removeClass("red")
    })
    $('.wrap').on('transitionend',function (event) {
        if (event.target === this && !$(this).hasClass('to-pre')){
            $('.pre-container').remove()
        }
    })
}
function presentation() {
    $(document).on('click','.btn-sector',event=>{
        let btn = $(event.target)
        let pre1 = btn.parents('.pre-container')
        let id2 = btn.attr('next-id')
        let pos = btn.attr('node-pos')
        let node = getDom(id2)
        $('.node').removeClass("red")
        node.addClass("red")
        new preContainer(id2)
        let pre2 = $('.pre-' + id2)
        switch (pos) {
            case "1" :
                pre2.css({top: "100%"}).animate({top:"200px"})
                pre1.animate({top:"-100%"},()=>{
                    pre1.remove()
                })
                break
            case "2" :
                pre2.css({left: "-100%"}).animate({left:"10%"})
                pre1.animate({left:"100%"},()=>{
                    pre1.remove()
                })
                break
            case "3" :
                pre2.css({top: "-100%"}).animate({top:"200px"})
                pre1.animate({top:"100%"},()=>{
                    pre1.remove()
                })
                break
            case "4" :
                pre2.css({left: "100%"}).animate({left:"10%"})
                pre1.animate({left:"-100%"},()=>{
                    pre1.remove()
                })
                break
        }
    })
}
function keydown1234() {
    let isAnimate = false
    $(document).on('keydown',event=>{
        if (event.key === "1" && !isAnimate ||event.key === "2" && !isAnimate ||event.key === "3" && !isAnimate ||event.key === "4" && !isAnimate){
            let btn = $('.btn-sector-' + event.key)
            if (btn.length){
                let pre1 = $('.pre-container')
                let id2 = btn.attr('next-id')
                let node = getDom(id2)
                $('.node').removeClass("red")
                node.addClass("red")
                let pos = btn.attr('node-pos')
                new preContainer(id2)
                let pre2 = $('.pre-' + id2)
                switch (pos) {
                    case "1" :
                        pre2.css({top: "100%"}).animate({top:"200px"})
                       isAnimate = true
                        pre1.animate({top:"-100%"},()=>{
                         isAnimate = false
                            pre1.remove()
                        })
                        break
                    case "2" :
                        pre2.css({left: "-100%"}).animate({left:"10%"})
                        isAnimate = true
                        pre1.animate({left:"100%"},()=>{
                        isAnimate = false
                            pre1.remove()
                        })
                        break
                    case "3" :
                        pre2.css({top: "-100%"}).animate({top:"200px"})
                        isAnimate = true
                        pre1.animate({top:"100%"},()=>{
                        isAnimate = false
                            pre1.remove()
                        })
                        break
                    case "4" :
                        pre2.css({left: "100%"}).animate({left:"10%"})
                       isAnimate = true
                        pre1.animate({left:"-100%"},()=>{
                        isAnimate = false
                            pre1.remove()
                        })
                        break
                }
            }
        }
    })
}
function saveImg() {
    //图片储存
    addEventListener('trix-attachment-add',function (e) {
        if(!e.attachment.file)return false
        let achment = e.attachment
        let url = window.location.href + 'upload/'
        let data = new FormData()
        data.append("file",achment.file)
        fetch(url+'index.php',{
            method:'POST',
            body:data
        }).then(()=>{
            let attr = {
                url: url + achment.file.name,
                href: url + achment.file.name
            }
            achment.setAttributes(attr)
        })
    })
}





























