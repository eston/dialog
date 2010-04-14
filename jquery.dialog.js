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
  
  $.dialog = function($$opts) {
    var options = $.extend({}, $.dialog.defaults, $$opts);
  };
  
  var options = $.dialog.defaults = {
    title: 'Dialog Title',
    body: 'test',
    buttons: {class: 'ok', caption: 'OK'},
    fadeInterval: 200
  };
  
  var $dialogContainer = null;
  var width, height = null;
  
  $.dialog.hide = function(interval) {
    if (typeof interval == 'undefined' || !interval) {
      interval = options.fadeInterval;
    }
    
    if ($dialogContainer && $dialogContainer.hasClass('displayed')) {
      $dialogContainer.fadeOut(interval);
      $dialogContainer.removeClass('displayed');
    }
    if ($.browser.msie) {
      $('select').css('visibility', 'visible');
    }
  };
  
  $.dialog.show = function(data, interval) {
    if (typeof interval == 'undefined' || !interval) {
      interval = options.fadeInterval;
    }
    if ($.browser.msie) {
      $('select').css('visibility', 'hidden');
    }
    if (typeof data == 'object') {
      options = $.extend({}, $.dialog.defaults, data);
    }
    if (!$dialogContainer) {
      establishContainer();
    }
    if ($dialogContainer.hasClass('displayed')) {
      $.dialog.hide(interval);
    }
    generateWindow(options.title, options.body, options.buttons);
    
    if ($dialogContainer) {
      positionWindow();
      $dialogContainer.hide(0);
      $dialogContainer.css('visibility', 'visible');
      $dialogContainer.fadeIn(interval);
      $dialogContainer.addClass('displayed');
    }
  };

  
  function attachDefaultClickEvent($button, class) {
    $button.click($.dialog.hide);
  };
  
  function attachCustomClickEvent($button, class, callback) {
    var callbackFunc = callback;
    $button.click(function() {
      callbackFunc();
    })
  }
  
  function establishContainer() {
    $dialogContainer = $('<div id="is-jq-dialog" style="visibility: hidden;"></div>');
    $('body').append($dialogContainer);
  };

  function generateButton(buttonObject) {
    var class, caption, callback = '';
    if (typeof(buttonObject.class) != 'undefined') {
      class = ' ' + buttonObject.class;
    }
    if (typeof(buttonObject.caption) != 'undefined') {
      caption = buttonObject.caption;
    }
    
    var button_html = $('<a href="javascript:void(0);"'
                    + 'class="dialog-button' + class + '">'
                    + caption
                    + '</a>');
    $button = $(button_html);
    
    // do we have a custom callback?
    if (typeof (buttonObject.callback) == 'function') {
      // attach the event
      attachCustomClickEvent($button, buttonObject.class, buttonObject.callback);
    } else {
      attachDefaultClickEvent($button, buttonObject.class);
    }  
    $("#is-jq-dialog-buttons").append($button);
  }
  
  function generateWindow(title, html, buttons) {
    var html = '<div id="is-jq-dialog-inner">'
             + '<div id="is-jq-dialog-title"><h3>' + title + '</h3></div>'
             + '<div id="is-jq-dialog-content">' + html + '</div>'
             + '<div id="is-jq-dialog-buttons"></div>'
             + '</div>';
    var $dialogContent = $(html);
    
    if ($dialogContainer) {
      $dialogContainer.html('');
    }
    $dialogContainer.append($dialogContent);

    // there is probably a better array check
    if (typeof(buttons.length) != 'number') {
      generateButton(buttons);
    } else if (buttons.length) {
      for (var i=0; i < buttons.length; i++) {
        generateButton(buttons[i]);
      }
    }
  };
  
  function positionWindow() {
    
    if (!width) {
      width = $('#is-jq-dialog-inner').width();
    }
    if (!height) {
      height = $('#is-jq-dialog-inner').height();  
    }
    
    var window_x = $(window).width();
    var window_y = $(window).height();
    var setWidth = Math.ceil((window_x / 2) - (width / 2));
    var setHeight = Math.ceil((window_y / 2) - (height / 2));
    console.log(width, height, window_x, window_y, setWidth, setHeight);
    
    // set proper heights and widths
    $('#is-jq-dialog').css('top', setHeight + 'px');
    $('#is-jq-dialog').css('left', setWidth + 'px');
  };
  
})(jQuery);