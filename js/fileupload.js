Dropzone.autoDiscover = false;

var sku = $('#hsku')[0].value;
var store = $('#store')[0].value;

$("#dropzone").dropzone({ url: "/file_upload?sku=" + sku + '&store=' + store});

function edit(id, name) {
  var xml = new XMLHttpRequest();
  var rename = $('#picName-' + id)[0].value;
  xml.open('GET', '../rename?name=' + name + '&rename=' + rename, true);
  xml.send(null);
  location.reload();
}

function delete_image(name) {
  var xml = new XMLHttpRequest();
  xml.open('GET', '../delete_image?name=' + name, true);
  xml.send(null);
  location.reload();
}
