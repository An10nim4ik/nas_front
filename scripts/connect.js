//     let flag = false;
// function mynewfunc(){
//     const a = document.getElementsByTagName("input");
//     for(let i = 0; i < a.length; i++){
//         if(!a[i].value) flag = true;
//         console.log(a[i].value);
//     }
//     if(flag){
//         alert("Something went wrong, please fill out every lane");
//     }else{
//         let a = document.getElementById("id1");
//         a.href = "index.html";
//     }
// }

window.onload=function(){ 
    var x = document.getElementById("loginbtn");
    x.addEventListener("click", signin);
    var y = document.getElementById("regbtn");
    y.addEventListener("click", signup);
}

function signup(){
    let btn1 = document.getElementById("login");
    btn1.style.backgroundColor = "rgb(0, 80, 255)";
    let btn2 = document.getElementById("reg");
    btn2.style.backgroundColor = "rgb(0, 60, 200)";
    document.getElementById("sign_up").style.display = "block";
    document.getElementById("sign_in").style.display = "none";
}

function signin(){
    let btn1 = document.getElementById("reg");
    btn1.style.backgroundColor = "rgb(0, 80, 255)";
    let btn2 = document.getElementById("login");
    btn2.style.backgroundColor = "rgb(0, 60, 200)";
    document.getElementById("sign_in").style.display = "block";
    document.getElementById("sign_up").style.display = "none";
}