function addToCart(sku, amount, name, price) {
  $.ajax({type: 'GET', url: '/addtocart?sku=' + sku + '&amount=' + amount}).done( data => {
    $('#cat').removeClass('d-none');
    $('#cat').parent().addClass('pr-1');
    $('#cat').parent().removeClass('pr-3');
    let found = false;
    $('.dropdown-menu.dropdown-menu-right.mt-2 a h6').each( function() {
      if ($(this).text() == name) {
        found = true;
        let total = parseFloat($(this).next().html().split('$')[1]);
        $(this).next().html('$' + (total + parseFloat(price)).toFixed(2));
      }
    });
    if (!found) {
      let element = "<a class= 'dropdown-item' href='/viewproduct=" + sku + "'><div class='row'><div class='col-xs'><img class='dropdown-img img-thumbnail' src='/main?sku=" + sku + "'></div><div class='col-xs ml-2 cart-dropdown'><h6>" + name + "</h6><span>$" + price + "</span></div></div></a>";
      $('.dropdown-menu.dropdown-menu-right.mt-2').prepend(element);
      if($('span.badge.badge-danger.ml-2').length === 0) {
        let badge = "<span class='badge badge-danger ml-2'>0</span>"
        $('#cdd').append(badge);
      }
    }
    let totalItems= parseInt($('span.badge.badge-danger.ml-2').text(), 10);
    $('span.badge.badge-danger.ml-2').html(totalItems + 1);
    let total = parseFloat($('#ct').text().split('$')[1]);
    total += parseFloat(price);
    $('#ct').text($('#ct').text().split('$')[0] + '$' + total.toFixed(2));
  });
}
