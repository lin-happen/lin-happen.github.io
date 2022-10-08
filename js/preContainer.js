class preContainer {
    constructor(id){
        this.id = id
        this.createDom()
    }
    createDom(){
        let content = data[this.id].content ? data[this.id].content : "Default Content"
        let dom = `<div class="pre-container pre-${this.id}">
                    <div class="pre-content">${content}</div>
                    <div class="button-box">`
        linkEach(this.id,(pos,val)=>{
            let inputName = val.inputName ? pos + "-" + val.inputName : pos + "- default relation" + pos
            dom += `<button class="btn-sector btn-sector-${pos}" next-id="${val.id2}" node-pos="${pos}">${inputName}</button>`
        })
        dom += `</div></div>`
        $('#presentation').append(dom)
    }

}









































