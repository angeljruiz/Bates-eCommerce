$('.qty-input i').click(function() {
  val = parseInt($('.qty-input input').val());
  id = parseInt($('#hid').val());

  if ($(this).hasClass('less')) {
      val = val - 1;
  } else if ($(this).hasClass('more')) {
      val = val + 1;
  }
  if (val < 1) {
      val = 1;
  }

  $('.qty-input input').val(val);
  $('#atc').attr('href', '/addtocart/' + id + '/' + val);
});

$('.qty-input i').on("wheel", "input[type=number]", function (e) {
    $(this).blur();
});


var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}
