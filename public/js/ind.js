// code for automatic slideShow
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}
// let slideIndex =1;
// slideShow(slideIndex);

// // for button
// function plusSlides(n){
//    slideShow(slideIndex += n);
// }

// // thumbNail
// function currentSlide(n){
//     slideShow(slideIndex = n);
// }

// function slideShow(n){
//     let i;
//     let slides = document.getElementsByClassName("mySlides");
//     let dots = document.getElementsByClassName("dot");
//     if(n>slides.length){slideIndex=1 }
//     if(n<1){slideIndex = slides.length}
//     // setting all the slidesdisply type none
//     for(i = 0; i < slides.length; i++){
//         slides[i].style.display = "none";
//     }
//     // removing all the active class present in the dot class
//     for(i = 0; i<dots.length; i++){
//           dots[i].className = dots[i].className.replace("active", "");
//     }
//     slides[slideIndex-1].style.display = "block";
//     dots[slideIndex-1].className += " active";
//     setTimeout(slideShow, 2000);
// }