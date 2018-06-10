$(document).on("change", ":file", function() {
  var label = $(this)
    .val()
    .replace(/\\/g, "/")
    .replace(/.*\//, "");
  console.log(label);
  $(".custom-file-label").html(label);
});
