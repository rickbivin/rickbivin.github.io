var myArray = location.pathname.split('/');
myArray.shift();
var survey = myArray.shift();

// ======== jquery functions ===============================
$(document).ready(function() {

  /* ucount_entrance warning */
  if( $('#email-opt-out').length ) {
    $('#email-opt-out').click( function() {
      if( $(this).is(":checked") ) { $('#confirm-noemail').modal('show'); }
    });
  }

  /* geo_map store values */
  if( $('#mapdiv').length ) {

    // All map load
    loadMap();

    // Handle the map case where someone triggers an error or something...
    if( $('#RESG_TAB2010BLKST').val() != '' ) {
      // Let's go somewhere new
      rtnp_utils.startWithBlock( $('#RESG_TAB2010BLKST').val(), $('#RESG_TAB2010BLKCOU').val(), $('#RESG_TAB2010BLKTRACT').val(), $('#RESG_TAB2010BLK').val() );
    }

    rtnp_utils.cbFuncBlock_orig = rtnp_utils.cbFuncBlock;
    rtnp_utils.cbFuncBlock = function cbFuncBlock(jsonres) {
      rtnp_utils.cbFuncBlock_orig(jsonres);
      if( rtnp_utils.attributes_all !== undefined ) {
        $('#RESG_TAB2010BLKST').val(rtnp_utils.attributes_all.STATE);
        $('#RESG_TAB2010BLKCOU').val(rtnp_utils.attributes_all.COUNTY);
        $('#RESG_TAB2010BLKTRACT').val(rtnp_utils.attributes_all.TRACT);
        $('#RESG_TAB2010BLK').val(rtnp_utils.attributes_all.BLOCK);
      }
    };
  }

  // Help modals along
  $('#helplink').removeAttr('target');

  // Default no answer (broad)
  if( $('#unanswer').length ) { $(':checked').removeAttr('checked'); }

  // Standard_confirm default no answer
  if( $('#STANDARD_CONFIRM_1').length ) { $(':checked').removeAttr('checked'); }

  // Set up sessionmodal
  if ( typeof SessionModal == 'function' ) {
    var sessionModal = new SessionModal({expiresIn: 14, warningLength: 2, logoutURL: location.pathname.split('/', 2)[1] + '/timeout'});
  }

  /// autocomplete
  if( $('.autocomplete').length ) {
    var path = '/' + survey + '/autocomplete';
    $('.autocomplete').autocomplete({
      source: function( request, response ) {
        var term = extractLast( request.term );
        var list = $.ajax({
                     dataType: "json",
                     url: '/censustest/autocomplete',
                     data: 'term=' + term,
                     success: function(data) { response( data ); },
                   });
        //response( list );
      },
      focus: function() {
        return false;
      },
      select: function( event, ui ) {
        var terms = split( this.value );
        terms.pop();
        terms.push( ui.item.value );
        terms.push("");
        this.value = terms.join(", ");
        return false;
      },
      minLength: 3
    }).each( function() { 
      $(this).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>"+ item.label + "</a>" ) 
            .appendTo( ul );
      };
    });
    $('.autocomplete').bind( "autocompleteclose input change", function() {
      $(this).val($(this).val().replace("&aacute;","\xE1").replace("&eacute;","\xE9").replace("&iacute;","\xED").replace("&oacute;","\xF3").replace("&uacute;","\xFA").replace("&ntilde;","\xF1"));
    });
  }

  if( $('#people').length ) {
    $('.spcase').removeClass('visible-xs-block').addClass('hide');
    $('#list').removeClass('hide');
  }


  if( $('#un3').length ) {
    $('#un1, #un2, #un3').numeric();
  }

      
      $(".tqa_no").hide();
      $(".tqa_yes").hide();
      $('input[name="TQA_VER"]').click(function(){
          if($(this).attr("value")=="1"){
             $(".tqa_no").hide();
             $(".tqa_yes").show();
          }
          if($(this).attr("value")=="2"){
             $(".tqa_yes").hide();
             $(".tqa_no").show();
          }
       });
//    Fullstay pages  
  $("[name='prev_addr']").change(function() {
     addr_radio = $(this).val();
     if (addr_radio != 8) {
        $('#formfields').hide();
         $('#p_addr_number').val('');
         $('#p_addr_street_line1').val('');
         $('#p_addr_apartment').val('');
         $('#p_addr_city').val('');
         $('#p_addr_state').val('');
         $('#p_addr_zip').val('');
         $('#full_desc').val('');
         $('#rr_desc').val('');
         $('#res_rrnum').val('');
         $('#res_boxnum').val('');
         $('#pobox').val('');
     }else{
        $('#formfields').show();
     }

   });

$("#previous_addresses").each(function() {
    if ($(this).css("visibility") == "hidden") {
          $('#formfields').show();
      }else {
              var addr_radio = $("[name='prev_addr']:checked").val();
                 if (addr_radio == 8) {
                   $('#formfields').show();
                 }else{
                  $('#formfields').hide();
                  }
      }
});

 
 // Maxlength limiter for textbox on del_other_2
 if( $('#DEL_OTHER_WI, #full_desc').length ) {
   $('#DEL_OTHER_WI, #full_desc').maxlength({
     status: false,
     maxCharacters: 250
   });
 }

 if( $('#roster_review').length ) {
   roster_setup();
 }

 if( $('#RELATION_1').length ) {
   if( $('#clearval').length ) { $(':checked').prop('checked',false); }
   relation_setup();
 }

 // These are not data pages, just confirmations, so ditch old stuff in case it comes back around
 if( $('#SEXCONFIRM_1').length ) {
   $('input[name="SEXCONFIRM"]').prop('checked',false);
 }
 if( $('#RELCONFIRM_1').length ) {
   $('input[name="RELCONFIRM"]').prop('checked',false);
 }

 // New window for instructions and idustry codes
 $(function(){
   $('a.help, a.new-window').click(function(){
     var w = window.open( $(this).attr('href'),"NewWin","width=400,height=500,resizable=1,scrollbars=1,top=0,right=0,menubar=0,status=0" );
     w.focus();
     return false;
   });
 });

// Hide name boxes on people/stay pages
 $('div.ppltbl').each(function(index) {
   var counter = 0;
   $(this).find('input').each(function(index) {
     if ( $(this).val() != '' ) {
       counter++;
     }
   })
   if ( counter == 0 ) {
     $(this).hide();    
   } 
 })

// Hide name boxes on add pages
 $('div.table_row').each(function(index) {
   var counter = 0;
   $(this).find('input').each(function(index) {
     if ( $(this).val() != '' ) {
       counter++;
     }
   })
   if ( counter == 0 ) {
     $(this).hide();    
   } 
 });

  // People link fix
  if( $('#people').length ) {
    var max;
    if( $('.NameHeaders').attr('data-people') == 1 ) { max = 8; } else { max = 48; }
    expandtable_default(max);
  }

  if( $('#add_moved').length ) {
    expandrow_default(document.getElementById('expand'), 9, 'nolonger', 'nolonger_row');
  }

  if( $('#PHONE_AREA').length ) {
    $('#PHONE_AREA').numeric();
    $('#PHONE_PREFIX').numeric();
    $('#PHONE_SUFFIX').numeric();
  }

  if( $('#addr_zip, #p_addr_zip').length ) {
    $('#addr_zip, #p_addr_zip').numeric();
  }

  $('#delete_7_2_3, #addr_desc_line1, #CFU_MOST_DESC, #CFU_WHERE_DESC').keyup(function() {
    set_textarea_max(this, 250);
  });

  if ( $('#DOB_MONTH').length ) {
    monthChanged(); // On document ready
    $('#DOB_MONTH').change( function() { monthChanged(); setage('DOB_YEAR','DOB_MONTH','DOB_DAY','DOB_AGE');} );
    $('#DOB_DAY').change( function() { $('.day').css('background-color','').css('font-weight',''); setage('DOB_YEAR','DOB_MONTH','DOB_DAY','DOB_AGE');} );
    $('#DOB_YEAR').change( function() { monthChanged(); setage('DOB_YEAR','DOB_MONTH','DOB_DAY','DOB_AGE'); } );
  }

  if ( $('#fieldset_STAY').length ) {
    if ( ! $('#MISS_1').attr('checked') ) {
      $('div#fieldset_STAY').hide();
      $('input.text').attr('disabled','disabled');
    }

    $('input[name="MISS"]').click( function() {
      if ( $('#MISS_1').attr('checked') ) {
        $('div#fieldset_STAY').show();
        $('input.text').removeAttr('disabled');
      }
      else {
        $('div#fieldset_STAY').hide();
        $('input.text').attr('disabled','disabled');
      }
    });
  }

  if ( document.getElementById ('ADD_PPL_1') != null ) {
    show_hide_add_rows( 'ADD_PPL_1', 'addppl' );
  }

  if ( document.getElementById ('ADD_NOPERMPLACE_1') != null ) {
    show_hide_add_rows( 'ADD_NOPERMPLACE_1', 'permanent' );
  }

  if ( document.getElementById ('ADD_NOLONGERHERE_1') != null ) {
    show_hide_add_rows( 'ADD_NOLONGERHERE_1', 'nolonger' );
  }


  $('input[name="ADD_PPL"]').click( function() {
    show_hide_add_rows( 'ADD_PPL_1', 'addppl' );
  });

  $('input[name="ADD_NOPERMPLACE"]').click( function() {
    show_hide_add_rows( 'ADD_NOPERMPLACE_1', 'permanent' );
  });

  $('input[name="ADD_NOLONGERHERE"]').click( function() {
    show_hide_add_rows( 'ADD_NOLONGERHERE_1', 'nolonger' );
  });


  // JS to address the new fullstay page functions

  if ( $('#res_radio_group').length ) {
    $res_radio = $('input[name="full_radio"]:checked').val();

    if( typeof $res_radio == 'undefined' ){
      $('input[name=full_radio]').filter('[value=1]').prop('checked', true);
      $res_radio = 1;
    }
    resSetHidden( $res_radio );

    $('input[name="full_radio"]').change( function() { resSetHidden( $(this).filter(':checked').val() ); } );
  }

  // PR additions to residence
  if( $('#residence, #fullstay').length ) {

    $('#addr_state, #p_addr_state').change(function(){
      var val = $(this).val();
      if( val == 52 ) {
        $('.res').addClass('hide');
        $('.prpage').removeClass('hide');
        if( $('#city_label_container').length ) { $('#city_label_container').removeClass('col-md-3').addClass('col-md-4'); }
        $('#city_label_st').addClass('hide');
        $('#city_label_pr').removeClass('hide');
        if( $('#helplink').is('[data-res]') ) { // if we are coming from the res version
          $('#helplink').attr('data-pr', $('#helplink').attr('href') );
          $('#helplink').attr('href',     $('#helplink').attr('data-res') );
          $('#helplink').removeAttr( 'data-res' ); // delete data-res
        }
      }
      else {
        $('.res').removeClass('hide');
        $('.prpage').addClass('hide');
        if( $('#city_label_container').length ) { $('#city_label_container').removeClass('col-md-4').addClass('col-md-3'); }
        $('#city_label_st').removeClass('hide');
        $('#city_label_pr').addClass('hide');
        if( $('#helplink').is('[data-pr]') ) { // if we are coming from the pr version
          $('#helplink').attr('data-res', $('#helplink').attr('href') );
          $('#helplink').attr('href',    $('#helplink').attr('data-pr') );
          $('#helplink').removeAttr( 'data-pr' ); // delete data-pr
        }
      }
    }).trigger('change');

    if( $('#submit_prev').length && !$('#fullstay').length ) {
      $('.prmulti').addClass('hidden');
      $('.prmulti').focus(function(){ $(this).blur(); });
    }

    $pr_radio = $('input[name="full_radio_pr"]:checked').val();

    if( typeof $pr_radio == 'undefined' ){
      $('input[name=full_radio_pr]').filter('[value=1]').prop('checked', true);
      $pr_radio = 1;
    }
    resPrHidden( $pr_radio );

    $('input[name="full_radio_pr"]').change( function() { resPrHidden( $(this).filter(':checked').val() ); } );

  }
  

/*****************LOGIN PAGE*******************/

$('#redarrow').hide();
if ( $('#login_error_msg').is(':visible') ) {
      $('#pin').css('background-color', '#FFFC9C');
      $('#redarrow').show();
  }

/* General errors */
/*if( $('.highlight').length ) {
  $('.highlight').before( "<img src='/static/censustest/images/redarrow.jpg' />" );
}*/

}); // END READY

/* autocomplete helper functions */
function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}

/* Start functions */

function resPrHidden( val ) {
  if( val == 1 ) {
    $( '#res_barrio, #barrio_overflow' ).removeClass( "hidden" );
    $( '#res_urban'  ).addClass(    "hidden" );
    $( '#res_multi'  ).addClass(    "hidden" );
    $( '.notmulti'   ).removeClass( "hidden" );
  }
  else if( val == 2 ) {
    $( '#res_barrio, #barrio_overflow' ).addClass( "hidden" );
    $( '#res_urban'  ).removeClass( "hidden" );
    $( '#res_multi'  ).addClass(    "hidden" );
    $( '.notmulti'   ).removeClass( "hidden" );
  }
  else if( val == 3 ) {
    $( '#res_barrio, #barrio_overflow' ).addClass( "hidden" );
    $( '#res_urban'  ).addClass(    "hidden" );
    $( '#res_multi'  ).addClass(    "hidden" );
    $( '.notmulti'   ).removeClass( "hidden" );
  }
  else {
    $( '#res_barrio, #barrio_overflow' ).addClass( "hidden" );
    $( '#res_urban'  ).addClass( "hidden" );
    $( '#res_multi'  ).removeClass( "hidden" );
    $( '.notmulti'   ).addClass( "hidden" );
  }
}

//Fullstay hide/reveal based on val
function resSetHidden( val ) {
  if( val == 1 ) {
    $( '#res_address'   ).removeClass( "hidden" );
    $( '#res_pobox'     ).addClass(    "hidden" );
    $( '#res_rural'     ).addClass(    "hidden" );
    $( '#res_note'      ).addClass(    "hidden" );
  }
  else if( val == 3 ) {
    $( '#res_address'   ).addClass(    "hidden" );
    $( '#res_pobox'     ).removeClass( "hidden" );
    $( '#res_rural'     ).addClass(    "hidden" );
    $( '#res_note'      ).removeClass( "hidden" );
  }
  else {
    $( '#res_address'   ).addClass(    "hidden" );
    $( '#res_pobox'     ).addClass(    "hidden" );
    $( '#res_rural'     ).removeClass( "hidden" );
    $( '#res_note'      ).removeClass( "hidden" );
  }
}


function monthChanged() {
    var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var year = parseInt($('.year').val(), 10);
    if ( year ) {
      // one year after refdate to match the dropdown
      //REFDATE refdate
      year = 2016 - year;
    }
    var month = $('.month').val() - 1;
    // Check for leap year if Feb
       if (year % 4 != 0)  {
           days[1]--;
         }
       //Millennial year divisible by 400 exception, please update for 2110 census.
       if (year == 1900) {
           days[1]--;  
       }
    // Add/Remove options
    if ($('.day option').length > days[month] + 1) {
        // Remove
        if ( $('.day').val() > days[month] ) {
          $('.day').css('background-color','#FDF8DF').css('font-weight','bold');
        }
        $('.day option').slice(days[month] + 1).remove();
    } else if ($('.day option').length < days[month] + 1) {
        // Add
        for (var i = $('.day option').length; i <= days[month]; i++) {
            $('<option>').attr('value', i).text(i).appendTo('.day');
        }
    } /*else {
        console.log( "3" );
        for (var i = $('.day option').length; i <= 31; i++) {
            $('<option>').attr('value', i).text(i).appendTo('.day');
        }
    }*/
}

function setage(year,month,day,outinput)
{
  window.focus();

  //var today = new Date();
  //REFDATE/refdate
  var nowyear = 2015;
  var nowmonth = 9;
  var nowday = 1;

  var yearv = document.getElementById(year).value;
  var monthv = document.getElementById(month).value;
  var dayv = document.getElementById(day).value;
  var outputobj = document.getElementById(outinput);

  var byear = parseInt(yearv, 10);
  if ( byear ) {
    byear = nowyear - byear + 1;
  }

  var bmonth = parseInt(monthv, 10);
  var bday = parseInt(dayv, 10);

  var yearlow = nowyear - 126;

  if ( ( byear >= yearlow && byear <= nowyear ) && ( bmonth >= 1 && bmonth <= 12 ) ) {
    if ( !bday ) { bday = 0; }

    if ( bmonth == nowmonth && ( bday < 1 || bday > 31 ) ) {
      outputobj.value = '';
    }
    else if ( byear == nowyear && ( bmonth > nowmonth || ( bmonth == nowmonth && bday > nowday ) ) ) {
      outputobj.value = '';
    }
    else {
      var age = nowyear - byear;

      if (bmonth > nowmonth) {age = age - 1}  // next birthday not yet reached
      else if (bmonth == nowmonth && nowday < bday) {age = age - 1}

      if ( age <= 0 ) { age = 0 }

      if ( age > 125 ) { outputobj.value = ''; }
      else { outputobj.value = age.toString(); }
    }
  }
  else {
    outputobj.value = '';
  }

  if( outputobj.value == '' ) {
    $('#age_js_p').addClass('hide');
    $('#age_js_q').removeClass('hide');
  }
  else {
    $('#age_js_p').removeClass('hide');
    $('#age_js_q').addClass('hide');
    $('#age_js').html(outputobj.value);
  }
}

function autotab(original,destination)
{
  var originalo = document.getElementById(original);
  var destinationo = document.getElementById(destination);

  if (originalo.getAttribute&&originalo.value.length==originalo.getAttribute("maxlength"))
  {
    destinationo.focus();
  }
}

function enabledisable(goodi, badi)
{
  var good = document.getElementById(goodi);
  var bad = document.getElementById(badi);

  good.disabled = false; 
  good.readOnly = false;
  good.style.backgroundColor = 'white';

  bad.disabled = true;
  bad.readOnly = true;
  bad.style.backgroundColor = '#C0C0C0';
  
  return true;
}

function expandtable(max,tblmax)
{
  if ( typeof expandtable.counter == 'undefined' ) {
        // It has not... perform the initilization
        expandtable.counter = 1;
    }
  if ( document.getElementById("form_" + expandtable.counter) ) {
    document.getElementById("form_" + expandtable.counter).style.display = 'inline';
  }
  
  ++expandtable.counter;

  if ( expandtable.counter == tblmax ) {
    $('#expand').css('display', 'none');
  }

}

function expandtable_default(tblmax)
{
  var count = 1;
  for( var i = 1; i < tblmax; i++ )
  {
    if( document.getElementById("form_" + i).style.display != 'none' )
    {
      count++;
    }
  }
  expandtable.counter = count;
  if ( expandtable.counter == tblmax ) {
    $('#expand').css('display', 'none');
  }
}

function containsElement(arr, ele) {
  var found = false, index = 0;
  while(!found && index < arr.length) {
    if(arr[index] == ele)
      found = true;
    else
      index++;
  }
  return found;
}

function imposeMaxLength(Object, e, len)
{
  var key = e.keyCode;
  var filter = [8,37,38,39,40,46];
  if(Object.value.length >= len && !containsElement(filter,key)) { 
    return false; 
  }
}

//
// Disable the Enter key in IE to prevent buggy form submission
//
function noEnter(evt) {
  var evt  = (evt) ? evt : ( (event) ? event : null );
  var node = (evt.target) ? evt.target : ( (evt.srcElement) ? evt.srcElement : null );

  if (evt.keyCode == 13) {
    if ( !(node.type == "submit" || node.type == "textarea" ) ) {
      return false;
    }
  }
}
document.onkeypress = noEnter;


//function to expand/contract a div
function toggleShow(divid)
{
  var div = document.getElementById(divid);

  if(div.style.display == 'none')
  {
    div.style.display = 'block';
  }
  else
 { 
    if(div.style.display == '')
    {
      div.style.display = 'block';
    }
    else {
    div.style.display = 'none';}
  }
}

function oncheckboxselectgoto(inputname, gotolocation)
{
  var inputv = document.getElementById(inputname);
  if(inputv.checked == true)
  {
    document.forms[2].elements[0].value = gotolocation;
  }
}


function showHelp(topic,jumpto) {

  var x = typeof window.screenLeft != 'undefined' ? window.screenLeft : window.screenX;
var y = typeof window.screenTop != 'undefined' ? window.screenTop - 22 : window.screenY;

  x = x + 550;

  if(navigator.appName == "Microsoft Internet Explorer")
  {y = y+50;}
  else
  {y = y + 200;}

    var link = '/' + survey + '/' + topic;
    if( jumpto ) { link = link + "?originpage=" + jumpto}
    helpWindow = window.open( link , "HelpPopUp", "status = 1, height = 500, width = 500, resizable = 1, scrollbars = 1, top = " + y + ", left = " + x + "" );
    helpWindow.focus();

    return false;
}

function set_textarea_max(field, maxchar) {
  var cnt = $(field).val().length;
  var remainingchar = maxchar - cnt;
  if(remainingchar < 0){
    $(field).val($(field).val().slice(0, maxchar));
  }
}

function hide_specify(specify_option, specify_table, add_names) {
  var item = document.getElementById(specify_table);
  var lnk = document.getElementById(add_names);
  if ( $('#' + specify_option).attr('checked') ) {
    item.className='specify_item';
    lnk.className='specify_item';
  }
  else {
    item.className='hidden_item';
    lnk.className='hidden_item';
  }
}

function delete_specify_val(specify_option, specify_box) {
  if ( $('#' + specify_option).attr('checked') ) {
  } else {
    $('#' + specify_box ).val( '' );
  }
}

function show_hide_add_rows(yes_id, specify_class) {
  if ( $('#' + yes_id).is(':checked') ) {
    $('#' + specify_class + '_table').show();
    $('#' + specify_class + '_table').find(':input').removeAttr('disabled');
  }
  else {
    $('#' + specify_class + '_table').hide();
    $('#' + specify_class + '_table').find(':input').attr('disabled','disabled');
  }
}

function expandrow(link, max, row_class, row_name)
{
  var count = 0;
  $('.' + row_class + ':visible').each(function() {
      count++;
  });

  if ( $('#' + row_name + "_" + count).length ) {
    $('#' + row_name + "_" + count).removeAttr('style');
    $('#' + row_name + "_" + count).removeClass('table_row');
  }

  if ( ++count >= max ) {
    $(link).css('display', 'none');
  }
}

function expandrow_default(link, max, row_class, row_name)
{
  var count = 0;
  $('.' + row_class + ':visible').each(function() {
      count++;
  });

  if ( ++count > max ) {
    $(link).css('display', 'none');
  }
}

/* ROSTER REVIEW */

function roster_setup()
{
  $('.edits').removeClass('hide');
  var track = 0;
  for( var i = 1; i <= 66; i++ ) {
    if( $('#NAME_FIRST_'+i).val() == '' &&
        $('#NAME_MIDDLE_'+i).val() == '' &&
        $('#NAME_LAST_'+i).val() == '' ) {
      $('#group_'+i).addClass('hide');
      if( track == 0 ) {
        track = i-1;
        $('#group_'+track).after("<div id=add_person_"+track+" class=add_person><a onClick='add_person("+track+", true);'>"+$('#lang').html()+"</a></div>");
      }
    }
    hide_inputs( i, true );
  }
}

function add_person( where, unhide ) {
  $('[id^="add_person"]').remove();
  where++;
  hide_group( where, false );
  $('#group_'+where).after("<div id=add_person_"+where+" class=add_person><a onClick='add_person("+where+", true);'>"+$('#lang').html()+"</a></div>");
  if( unhide ) {
    hide_inputs( where, false );
  }
}

function hide_inputs( i, which ) {
  if( which ) {
    $('#contain_f_'+i).addClass('hide');
    $('#contain_m_'+i).addClass('hide');
    $('#contain_l_'+i).addClass('hide');
    $('#replace_'+i).html(
      jQuery('<div/>').text(
        $('#NAME_FIRST_'+i).val()+' '+$('#NAME_MIDDLE_'+i).val()+' '+$('#NAME_LAST_'+i).val()
      || '' ).html()
      ).removeClass('hide');
    $('#edit_'+i).removeClass('hide');
    $('#done_'+i).addClass('hide');
    $('#delete_'+i).removeClass('hide');
    $('#edits_'+i).removeClass('col-xs-12');
    $('#edits_'+i).removeClass('col-md-3');
    $('#edits_'+i).addClass('col-xs-3');
  }
  else {
    $('#contain_f_'+i).removeClass('hide');
    $('#contain_m_'+i).removeClass('hide');
    $('#contain_l_'+i).removeClass('hide');
    $('#replace_'+i).html('').addClass('hide');
    $('#done_'+i).removeClass('hide');
    $('#edit_'+i).addClass('hide');
    $('#delete_'+i).addClass('hide');
    $('#edits_'+i).removeClass('col-xs-3');
    $('#edits_'+i).addClass('col-xs-12');
    $('#edits_'+i).addClass('col-md-3');
  }
}

function hide_group( i, which ) {
  if( which ) {
    $('#group_'+i).addClass('hide');
    $('#group_'+i).css( "height", "0" );
  }
  else {
    $('#group_'+i).removeClass('hide');
    $('#group_'+i).css( "height", "auto" );
  }
}

function click_edit( i ) {
  hide_inputs( i, false );
}

function click_done( i ) {
  hide_inputs( i, true );
  if( $('#NAME_FIRST_'+i).val() == '' &&
      $('#NAME_MIDDLE_'+i).val() == '' &&
      $('#NAME_LAST_'+i).val() == '' ) {
    click_delete( i );
  }
}

function click_delete_modal( i ) {
  var name = $('#NAME_FIRST_'+i).val()+' '+$('#NAME_MIDDLE_'+i).val()+' '+$('#NAME_LAST_'+i).val();
  name = name.trim();
  if( name == '' ) {
    $('#del_name').html('');
    $('#del_name_default').removeClass('hide');
  }
  else {
    $('#del_name').html(name);
    $('#del_name_default').addClass('hide');
  }
  $('#del_name').removeClass('hide');
  $('#del_yes').unbind('click');
  $('#del_yes').click( function() { click_delete( i ); });
}

function click_delete( i ) {
  for( i; i < 93; i++ ) {
    $('#NAME_FIRST_'+i).val($('#NAME_FIRST_'+(i+1)).val());
    $('#NAME_MIDDLE_'+i).val($('#NAME_MIDDLE_'+(i+1)).val());
    $('#NAME_LAST_'+i).val($('#NAME_LAST_'+(i+1)).val());
    if( $('#done_'+(i+1)).hasClass('hide') ) {
      hide_inputs( i, true );
    }
    else {
      hide_inputs( i, false );
    }
  }
  $('#NAME_FIRST_93').val('');
  $('#NAME_MIDDLE_93').val('');
  $('#NAME_LAST_93').val('');

  var addpos = parseInt($('[id^="add_person"]').attr('id').substring( 11 ));
  if( $('#NAME_FIRST_'+addpos).val() == '' &&
      $('#NAME_MIDDLE_'+addpos).val() == '' &&
      $('#NAME_LAST_'+addpos).val() == '' ) {
    hide_group( addpos, true );
    add_person( addpos-2, false );
  }
}

/* RELATION2 */

function relation_setup() {
  $('.rel_indent_radio').addClass('hide');

  if( $('#ADMIN_1').is(':checked') ) { $('.ADMIN_1').removeClass('hide'); }
  if( $('#ADMIN_2').is(':checked') ) { $('.ADMIN_2').removeClass('hide'); }

  $('input[name="ADMIN"]').click( function() {
    $('input[name="RELATION"]').prop('checked',false);
    $('.rel_indent_radio').addClass('hide');
    $('.'+$(this).attr('id')).removeClass('hide');
  });

  $('input[name="RELATION"]').not('.rel_admin_marker').click( function() {
    $('input[name="ADMIN"]').prop('checked',false);
    $('.rel_indent_radio').addClass('hide');
  });
}
