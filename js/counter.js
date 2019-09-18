$('.qty-input i').click(function() {
  val = parseInt($('.qty-input input').val());
  sku = parseInt($('#hsku').val());

  if ($(this).hasClass('less')) {
      val = val - 1;
  } else if ($(this).hasClass('more')) {
      val = val + 1;
  }
  if (val < 1) {
      val = 1;
  }

  $('.qty-input input').val(val);
  $('#atc').attr('href', '/addtocart/' + sku + '/' + val);
});

$('.qty-input i').on("wheel", "input[type=number]", function (e) {
    $(this).blur();
});


var slideIndex = 1;
showSlide(slideIndex);

// Next/previous controls
function move(n) {
  showSlide(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  var i;
  var slides = $('.slides');
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[slideIndex-1].style.display = 'block';
}
