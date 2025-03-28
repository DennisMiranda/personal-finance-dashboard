const wallet = document.getElementById("wallet");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");

wallet.addEventListener("click",()=>{
    barraLateral.classList.toggle("mini-barra-lateral");
    spans.forEach((span)=>{
        span.classList.toggle("oculto");
    });
});