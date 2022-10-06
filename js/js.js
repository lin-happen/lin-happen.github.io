$('.check').click(function () {
    if ($(this).prop("checked")){
        $(".childrenNum").attr("disabled",false)
    }else{
        $(".childrenNum").attr("disabled",true)
    }
})


let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1
if (month < 10){
    month = "0" + month
}

let day = date.getDate()+1
if (day < 10){
    day = "0" + day
}
let time = year +'-'+ month +'-'+ day;
$("input[name='date']").attr("min",time)


$('.online').click(function () {
    let phone = $(".phone").val()
    let regex = /1\d{10}/
    let num = parseInt($(".num").val())
    let childrenNum = parseInt($('.childrenNum').val())
    let he = 0
    let museum = $(".museumTicket").val()
    if (museum === "s"){
        $(".count").html(num*25)
    }else{
        $(".count").html(num*10)
    }
    if (!$('.childrenNum').prop('disabled')){
        he = num + childrenNum
        if (he > 5){
            alert("numbers of attendees is to much")
            return false
        }
    }

    if (!regex.test(phone)){
        alert("phone wrong")
        return false
    }
})
$(".confirm").click(function () {
    alert("Booking payment successful")
    return false
})
$(".scene").click(function () {
    alert("Feedback on booking success")
    return false
})

$(".cbl").click(function () {
    $(".side").toggleClass("goin")
})
$("body").toggle().fadeIn()