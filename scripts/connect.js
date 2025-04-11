function mynewfunc(){
    let flag = false;
    const a = document.getElementsByTagName("input");
    for(let i = 0; i < a.length; i++){
        if(!a[i].value) flag = true;
        console.log(a[i].value);
    }
    if(flag){
        alert("Something went wrong, please fill out every lane");
    }else{
        let a = document.getElementById("id1");
        a.href = "index.html";
    }
}