// ======== jquery functions ===============================
$(document).ready(function() {

  // Focus on first input element on every page, unless login, roster_a or disabled
  if ( $('#un1').val() ) {
    $('#password').focus();
  }
  else {
    $('#un1').focus();
  }

}); // END READY
// =========================================================

function autotab(original, destination, e) {
  if (e === undefined) {
    var code = 48;
  }
  else {
    var code = e.keyCode ? e.keyCode : e.charCode;
  }

  if ( code >= 48 && code <= 90 || code >= 96 && code <= 105 ) {
    if( original.value.length >= original.maxLength ) {
      document.getElementById(destination).focus();
    }
  }
}

