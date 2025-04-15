let flag = false;

function validate(){
    if(flag){
        register();
    }else{
        login();
    }
}

function register(){
    const regdata = document.getElementById("sign_up");
    let datas = regdata.children;
    var flag1 = true;
    for(let data of datas){
        if(data.tagName == "INPUT"){
            let x = data;
            if(x.value == ""){
                flag1 = false;
                break;
            }
        }
    }
    if(!flag1){
        alert("Please try again! You may have not written information in all of the lanes!");
    }else{
        window.location.href = "index.html";
    }
}

function login(){
    const regdata = document.getElementById("sign_in");
    let datas = regdata.children;
    var flag1 = true;
    for(let data of datas){
        if(data.tagName == "INPUT"){
            let x = data;
            if(x.value == ""){
                flag1 = false;
                break;
            }
        }
    }
    if(!flag1){
        alert("Please try again! You may have not written information in all of the lanes!");
    }else{
        window.location.href = "index.html";
    }
}

window.onload=function(){ 
    var x = document.getElementById("loginbtn");
    x.addEventListener("click", signin);
    var y = document.getElementById("regbtn");
    y.addEventListener("click", signup);
}

function signup(){
    let btn1 = document.getElementById("login");
    btn1.style.backgroundColor = "rgb(0, 100, 255)";
    let btn2 = document.getElementById("reg");
    btn2.style.backgroundColor = "rgb(0, 80, 180)";
    document.getElementById("sign_in").style.display = "none";
    flag = true;
    document.getElementById("sign_up").style.display = "block";
}

function signin(){
    let btn1 = document.getElementById("reg");
    btn1.style.backgroundColor = "rgb(0, 100, 255)";
    let btn2 = document.getElementById("login");
    btn2.style.backgroundColor = "rgb(0, 80, 180)";
    document.getElementById("sign_in").style.display = "block";
    document.getElementById("sign_up").style.display = "none";
    flag = false;
}