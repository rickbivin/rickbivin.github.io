var myArray = location.pathname.split('/');
myArray.shift();
var survey = myArray.shift();
var page = myArray.shift();
if ( myArray.length ) {
  page = page + '/' + myArray.join('/');
}

$(document).ready(function() {
  var SKIP_UNLOAD = 0;
  if ( !page ) {
    SKIP_UNLOAD = 1;
  }

  var myJSONObject;
  var pdJSON = $('#pdfib_dnu').val();
  if ( pdJSON ) {
    try{
      myJSONObject = JSON.parse( pdJSON );
    }catch(e){
      console.info("Unable to parse json, createing new structure");
    }
  }

  if ( ! myJSONObject ) {
    myJSONObject = {
      "timestamps": {
        "entry":[],
        "exit": [],
        "next": [],
        "previous":[],
        "return_to_review":[]
      },
      "links": {},
      "form_actions": {},
      "errors": {}
    };
  }

  //OnLoad for ONLY login page to pull browser information
  if ( $('#pdfib_dnu').attr("id") && $('#username').attr("id") ) {
    var timeStamp = get_timestamp();
    myJSONObject.env = {};
    myJSONObject.env.width = $(window).width();
    myJSONObject.env.height = $(window).height();
    myJSONObject.env.useragent = navigator.userAgent;

    if ( $('#prev_request').attr("id") ) {
      myJSONObject.timeout = {};
      myJSONObject.timeout.time = timeStamp;
      myJSONObject.timeout.request = $('#prev_request').val();
    }
    
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
  }

  //On page load, set entry timestamp
  myJSONObject.timestamps.entry.push( get_timestamp() );
  $('#pdfib_dnu').val(JSON.stringify(myJSONObject));

  //On page load, set error code timestamps, if exists
  if ( $('#error_codes').attr("id") ) {
    var codes = $('#error_codes').html().split(',');
    for (var i=0; i<codes.length; i++) {
      var code = codes[i];
      var code_timestamps = myJSONObject.errors[code];
      if ( !code_timestamps ) {
        code_timestamps = new Array();
        myJSONObject.errors[code] = code_timestamps;
      }
      code_timestamps.push( get_timestamp() );
    }

    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
  }
  else if ( $('.error').first().html() || $('.top_error').first().html() ) {
    var error_timestamps = myJSONObject.errors[1];
    if ( !error_timestamps ) {
      error_timestamps = new Array();
      myJSONObject.errors[1] = error_timestamps;
    }
    error_timestamps.push( get_timestamp() );

    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
  }

  // Click event
  $('a').click(function() {

    var timeStamp = get_timestamp();

    var url = $(this).attr("href");

    var urlList = myJSONObject.links[url];
    if ( !urlList ) {
      urlList = new Array();
      myJSONObject.links[url] = urlList;
    }
    urlList.push(timeStamp);
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));

    if ( $(this).attr("id") == 'logout' ) {
      post_paradata( myJSONObject, 'logout' );
      SKIP_UNLOAD = 1;
    }
  });

  $('#submit_next').click(function() {
    var timeStamp = get_timestamp();

    myJSONObject.timestamps.next.push(timeStamp);
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
    SKIP_UNLOAD = 1;
  });

  $('#submit_prev').click(function() {
    var timeStamp = get_timestamp();

    myJSONObject.timestamps.previous.push(timeStamp);
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
    SKIP_UNLOAD = 1;
  });

  $('#submit_return').click(function() {
    var timeStamp = get_timestamp();

    myJSONObject.timestamps.return_to_review.push(timeStamp);
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
    SKIP_UNLOAD = 1;
  });

  $('#submit_login').click(function() {
    var timeStamp = get_timestamp();

    myJSONObject.login_submit_ts = timeStamp;
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
  });

  // Change event
  // all inputs of type text, select; and  textarea
  $(':input, textarea, select, :radio, :checkbox, :text').change(function() {
    var name = $(this).attr("name");
    var value = $(this).val();
    var timeStamp = get_timestamp();

    if ( $(this).attr("type") == "checkbox" ) {
      var list = [];
      $(':checkbox[name="' + name + '"]').each(function(index) {
        if ( $(this).attr("checked") ) {
          list.push( $(this).val() );
        }
      });
      value = list;
    }

    var input = myJSONObject.form_actions[name];
    if ( !input ) {
      input = new Array();
      myJSONObject.form_actions[name] = input;
    }
    input.push( [value, timeStamp] );
    
    $('#pdfib_dnu').val(JSON.stringify(myJSONObject));
  });

  var paraform = $("#pdfib_dnu");
  if ( paraform.val() ) {
    $(window).bind( 'beforeunload.paradata', function() {
      if ( window.PD_FORCE_AJAX || SKIP_UNLOAD == 0 ) {
        post_paradata( myJSONObject, "unload" );
      }
    } );
  }
});


function post_paradata ( myJSONObject, action ) {
  var timestamp = myJSONObject.timestamps.exit.push( get_timestamp() );
  $('#pdfib_dnu').val(JSON.stringify(myJSONObject));

  if ( page ) {
    $.ajax({
      type: 'POST',
      url: location.protocol + '//' + location.host + '/' + survey + '/sdtdp/' + page,
      data: 'action=' + action + '&' + $("#pdfib_dnu").serialize(),
      async: false
    });
  }
}

function get_timestamp() {
  var epoch = Math.round(new Date().getTime() / 1000.0);
  return epoch;
}

