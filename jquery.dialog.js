/** 
 *  Dialog
 *  
 *  A simple little dialog plugin. We don't need all the bells and 
 *  whistles of a bigger one, really, so might as well just make 
 *  something small for now. MIT-licenced.
 *
 *  @provides dialog
 *  @author eston
 *
 *  Copyright (c) 2010 isocket, inc.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
**/

(function($) {

  $.fn.dialog = function($$opts) {
    var options = $.extend({}, $.fn.dialog.defaults, $$opts);
    
    $(this).click(function() {   
      // check to see if a dialog instance has been created on the page,
      // create if nonexistent
      if (!$dialogContainer) {
        establishContainer();
      }
      if ($dialogContainer.hasClass('displayed')) {
        hideDialog(options.fadeInterval);
      }
      generateWindow(options.title, options.body, options.buttons);
      showDialog(options.fadeInterval);
    });
  };
  
  $.fn.dialog.defaults = {
    title: 'Dialog Title',
    body: 'test',
    buttons: [{class: 'submit', caption: 'OK'}],
    fadeInterval: 600
  };
  
  $.fn.dialog.buttonType = {
    OK: [{ 
          class: 'submit',
          caption: 'OK' 
        }],
        
    OK_CANCEL: [{
                  class: 'submit',
                  caption: 'OK'
                },
                {
                  class: 'cancel',
                  caption: 'Cancel'
                }], 
                
    YES_NO: [{
                class: 'submit',
                caption: 'YES'
              },
              {
                class: 'cancel',
                caption: 'NO'
              }]
  };
  
  var $dialogContainer = null;
  
  function attachDefaultClickEvent($button, class) {
    switch (class) {
      case 'submit':
        $button.click(submitAndHideDialog);
        break;
      
      case 'cancel':
      default:
        $button.click(hideDialog);
        break;
    }
  };
  
  function attachCustomClickEvent($button, class, callback) {
    var callbackFunc = callback;
    $button.click(function() {
      callbackFunc();
      // quick shortcut
      if (class == 'nohide') {
        hideDialog();
      }
    })
  }
  
  function establishContainer() {
    $dialogContainer = $('<div id="is-jq-dialog"></div>');
    $('body').append($dialogContainer);
  };
  
  function submitAndHideDialog() {
    if ($('#js-iq-dialog form').length) {
      $('#js-iq-dialog form').each(function() {
        $(this).submit();
      });
    }
    hideDialog();
  };
  
  function hideDialog(interval) {
    if ($dialogContainer && $dialogContainer.hasClass('displayed')) {
      $dialogContainer.fadeOut(interval);
      $dialogContainer.removeClass('displayed');
    }
  };
  
  function showDialog(interval) {
    if ($dialogContainer) {
      $dialogContainer.fadeIn(interval);
      $dialogContainer.addClass('displayed');
    }
  };
  
  function generateWindow(title, html, buttons) {
    var html = '<div id="is-jq-dialog-inner">'
             + '<div id="is-jq-dialog-title">' + title + '</div>'
             + '<div id="is-jq-dialog-content">' + html + '</div>'
             + '<div id="is-jq-dialog-buttons"></div>'
             + '</div>';
    var $dialogContent = $(html);
    
    if ($dialogContainer) {
      $dialogContainer.html('');
    }
    $dialogContainer.append($dialogContent);
             
    for (var i=0; i < buttons.length; i++) {
      var button_html = $('<a href="javascript:void(0);"'
                      + 'class="' + buttons[i].class + '">'
                      + buttons[i].caption
                      + '</a>');
      $button = $(button_html);
      
      // do we have a custom callback?
      if (typeof (buttons[i].callback) == 'function') {
        // attach the event
        attachCustomClickEvent($button, buttons[i].class, buttons[i].callback);
      } else {
        attachDefaultClickEvent($button, buttons[i].class);
      }  
      $("#is-jq-dialog-buttons").append($button);
    }
  };
  
})(jQuery);